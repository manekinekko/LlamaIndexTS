import { PromptMixin, type ModuleRecord } from "@llamaindex/core/prompts";
import { Document, MetadataMode } from "@llamaindex/core/schema";
import { extractText } from "@llamaindex/core/utils";
import { SummaryIndex } from "../indices/summary/index.js";
import type {
  FaithfulnessRefinePrompt,
  FaithfulnessTextQAPrompt,
} from "./prompts.js";
import {
  defaultFaithfulnessRefinePrompt,
  defaultFaithfulnessTextQaPrompt,
} from "./prompts.js";
import type {
  BaseEvaluator,
  EvaluationResult,
  EvaluatorParams,
  EvaluatorResponseParams,
} from "./types.js";

export class FaithfulnessEvaluator
  extends PromptMixin
  implements BaseEvaluator
{
  private raiseError: boolean;
  private evalTemplate: FaithfulnessTextQAPrompt;
  private refineTemplate: FaithfulnessRefinePrompt;

  constructor(params?: {
    raiseError?: boolean | undefined;
    faithfulnessSystemPrompt?: FaithfulnessTextQAPrompt | undefined;
    faithFulnessRefinePrompt?: FaithfulnessRefinePrompt | undefined;
  }) {
    super();
    this.raiseError = params?.raiseError ?? false;

    this.evalTemplate =
      params?.faithfulnessSystemPrompt ?? defaultFaithfulnessTextQaPrompt;
    this.refineTemplate =
      params?.faithFulnessRefinePrompt ?? defaultFaithfulnessRefinePrompt;
  }

  protected _getPromptModules(): ModuleRecord {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _getPrompts(): { [x: string]: any } {
    return {
      faithfulnessSystemPrompt: this.evalTemplate,
      faithFulnessRefinePrompt: this.refineTemplate,
    };
  }

  protected _updatePrompts(promptsDict: {
    faithfulnessSystemPrompt: FaithfulnessTextQAPrompt;
    faithFulnessRefinePrompt: FaithfulnessRefinePrompt;
  }): void {
    if (promptsDict.faithfulnessSystemPrompt) {
      this.evalTemplate = promptsDict.faithfulnessSystemPrompt;
    }

    if (promptsDict.faithFulnessRefinePrompt) {
      this.refineTemplate = promptsDict.faithFulnessRefinePrompt;
    }
  }

  /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   * @param contexts Array of contexts
   * @param reference  Reference response
   * @param sleepTimeInSeconds  Sleep time in seconds
   */
  async evaluate({
    query,
    response,
    contexts = [],
    reference,
    sleepTimeInSeconds = 0,
  }: EvaluatorParams): Promise<EvaluationResult> {
    if (query === null || response === null) {
      throw new Error("query, and response must be provided");
    }

    await new Promise((resolve) =>
      setTimeout(resolve, sleepTimeInSeconds * 1000),
    );

    const docs = contexts?.map((context) => new Document({ text: context }));

    const index = await SummaryIndex.fromDocuments(docs, {});

    const queryEngine = index.asQueryEngine();

    queryEngine.updatePrompts({
      "responseSynthesizer:textQATemplate": this.evalTemplate,
      "responseSynthesizer:refineTemplate": this.refineTemplate,
    });

    const responseObj = await queryEngine.query({
      query: { query: response },
      stream: false,
    });

    const rawResponseTxt = responseObj.toString();

    let passing: boolean;

    if (rawResponseTxt.toLowerCase().includes("yes")) {
      passing = true;
    } else {
      passing = false;
      if (this.raiseError) {
        throw new Error("The response is invalid");
      }
    }

    return {
      query,
      contexts,
      response,
      passing,
      score: passing ? 1.0 : 0.0,
      feedback: rawResponseTxt,
    };
  }

  /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   */
  async evaluateResponse({
    query,
    response,
  }: EvaluatorResponseParams): Promise<EvaluationResult> {
    const responseStr = extractText(response?.message.content);
    const contexts = [];

    if (response) {
      for (const node of response.sourceNodes || []) {
        contexts.push(node.node.getContent(MetadataMode.ALL));
      }
    }

    return this.evaluate({
      query,
      response: responseStr,
      contexts,
    });
  }
}
