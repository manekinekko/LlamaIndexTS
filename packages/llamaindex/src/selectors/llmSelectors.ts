import type { LLM } from "@llamaindex/core/llms";
import type { ModuleRecord } from "@llamaindex/core/prompts";
import type { QueryBundle } from "@llamaindex/core/query-engine";
import type { BaseOutputParser } from "@llamaindex/core/schema";
import { extractText } from "@llamaindex/core/utils";
import type { Answer } from "../outputParsers/selectors.js";
import { SelectionOutputParser } from "../outputParsers/selectors.js";
import type {
  StructuredOutput,
  ToolMetadataOnlyDescription,
} from "../types.js";
import type { SelectorResult } from "./base.js";
import { BaseSelector } from "./base.js";
import type { MultiSelectPrompt, SingleSelectPrompt } from "./prompts.js";
import {
  defaultMultiSelectPrompt,
  defaultSingleSelectPrompt,
} from "./prompts.js";

function buildChoicesText(choices: ToolMetadataOnlyDescription[]): string {
  const texts: string[] = [];
  for (const [ind, choice] of choices.entries()) {
    let text = choice.description.split("\n").join(" ");
    text = `(${ind + 1}) ${text}`; // to one indexing
    texts.push(text);
  }
  return texts.join("");
}

function structuredOutputToSelectorResult(
  output: StructuredOutput<Answer[]>,
): SelectorResult {
  const structuredOutput = output;
  const answers = structuredOutput.parsedOutput;

  // adjust for zero indexing
  const selections = answers.map((answer) => {
    return { index: answer.choice - 1, reason: answer.reason };
  });

  return { selections };
}

/**
 * A selector that uses the LLM to select a single or multiple choices from a list of choices.
 */
export class LLMMultiSelector extends BaseSelector {
  llm: LLM;
  prompt: MultiSelectPrompt;
  maxOutputs: number;
  outputParser: BaseOutputParser<StructuredOutput<Answer[]>>;

  constructor(init: {
    llm: LLM;
    prompt?: MultiSelectPrompt;
    maxOutputs?: number;
    outputParser?: BaseOutputParser<StructuredOutput<Answer[]>>;
  }) {
    super();
    this.llm = init.llm;
    this.prompt = init.prompt ?? defaultMultiSelectPrompt;
    this.maxOutputs = init.maxOutputs ?? 10;

    this.outputParser = init.outputParser ?? new SelectionOutputParser();
  }

  _getPrompts() {
    return { prompt: this.prompt };
  }

  _updatePrompts(prompts: { prompt: MultiSelectPrompt }) {
    if ("prompt" in prompts) {
      this.prompt = prompts.prompt;
    }
  }

  protected _getPromptModules(): ModuleRecord {
    throw new Error("Method not implemented.");
  }

  /**
   * Selects a single choice from a list of choices.
   * @param choices
   * @param query
   */
  async _select(
    choices: ToolMetadataOnlyDescription[],
    query: QueryBundle,
  ): Promise<SelectorResult> {
    const choicesText = buildChoicesText(choices);

    const prompt = this.prompt.format({
      contextList: choicesText,
      query: extractText(query.query),
      maxOutputs: `${this.maxOutputs}`,
      numChoices: `${choicesText.length}`,
    });

    const formattedPrompt = this.outputParser?.format(prompt);

    const prediction = await this.llm.complete({
      prompt: formattedPrompt,
    });

    const parsed = this.outputParser?.parse(prediction.text);

    if (!parsed) {
      throw new Error("Parsed output is undefined");
    }

    return structuredOutputToSelectorResult(parsed);
  }

  asQueryComponent(): unknown {
    throw new Error("Method not implemented.");
  }
}

/**
 * A selector that uses the LLM to select a single choice from a list of choices.
 */
export class LLMSingleSelector extends BaseSelector {
  llm: LLM;
  prompt: SingleSelectPrompt;
  outputParser: BaseOutputParser<StructuredOutput<Answer[]>>;

  constructor(init: {
    llm: LLM;
    prompt?: SingleSelectPrompt;
    outputParser?: BaseOutputParser<StructuredOutput<Answer[]>>;
  }) {
    super();
    this.llm = init.llm;
    this.prompt = init.prompt ?? defaultSingleSelectPrompt;
    this.outputParser = init.outputParser ?? new SelectionOutputParser();
  }

  _getPrompts(): Record<string, SingleSelectPrompt> {
    return { prompt: this.prompt };
  }

  _updatePrompts(prompts: Record<string, SingleSelectPrompt>): void {
    if ("prompt" in prompts) {
      this.prompt = prompts.prompt;
    }
  }

  /**
   * Selects a single choice from a list of choices.
   * @param choices
   * @param query
   */
  async _select(
    choices: ToolMetadataOnlyDescription[],
    query: QueryBundle,
  ): Promise<SelectorResult> {
    const choicesText = buildChoicesText(choices);

    const prompt = this.prompt.format({
      numChoices: `${choicesText.length}`,
      context: choicesText,
      query: extractText(query),
    });

    const formattedPrompt = this.outputParser.format(prompt);

    const prediction = await this.llm.complete({
      prompt: formattedPrompt,
    });

    const parsed = this.outputParser?.parse(prediction.text);

    if (!parsed) {
      throw new Error("Parsed output is undefined");
    }

    return structuredOutputToSelectorResult(parsed);
  }

  asQueryComponent(): unknown {
    throw new Error("Method not implemented.");
  }

  protected _getPromptModules() {
    return {};
  }
}
