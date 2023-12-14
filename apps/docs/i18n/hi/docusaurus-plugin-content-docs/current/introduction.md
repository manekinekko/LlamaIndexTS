---
sidebar_position: 0
slug: /
---

# LlamaIndex.TS क्या है?

`इस दस्तावेज़ का अनुवाद स्वचालित रूप से किया गया है और इसमें त्रुटियाँ हो सकती हैं। परिवर्तन सुझाने के लिए पुल रिक्वेस्ट खोलने में संकोच न करें।`

LlamaIndex.TS एक डेटा फ्रेमवर्क है जो LLM एप्लिकेशन के लिए डेटा को इंजेस्ट, संरचित करने और निजी या डोमेन-विशिष्ट डेटा तक पहुंच करने के लिए उपयोग किया जाता है। जबकि एक पायथन पैकेज भी उपलब्ध है (यहां देखें [यहां](https://docs.llamaindex.ai/en/stable/)), LlamaIndex.TS एक सरल पैकेज में मूल विशेषताओं को पेश करता है, जो TypeScript के साथ उपयोग के लिए अनुकूलित है।

## 🚀 LlamaIndex.TS क्यों?

अपने मूल में, LLMs मानवों और अनुमानित डेटा के बीच एक प्राकृतिक भाषा इंटरफ़ेस प्रदान करते हैं। व्यापक रूप से उपलब्ध मॉडल पब्लिकली उपलब्ध डेटा पर पूर्व-प्रशिक्षित होते हैं, जैसे विकिपीडिया और मेलिंग सूचियों से लेकर पाठपुस्तकों और स्रोत कोड तक।

LLMs पर निर्मित एप्लिकेशन अक्सर इन मॉडल्स को निजी या डोमेन-विशिष्ट डेटा के साथ बढ़ाने की आवश्यकता होती है। दुर्भाग्य से, वह डेटा साइलोड एप्लिकेशन और डेटा स्टोर में वितरित हो सकता है। यह API के पीछे होता है, SQL डेटाबेस में होता है, या पीडीएफ और स्लाइड डेक में फंसा होता है।

यहां **LlamaIndex.TS** की भूमिका आती है।

## 🦙 LlamaIndex.TS कैसे मदद कर सकता है?

LlamaIndex.TS निम्नलिखित उपकरण प्रदान करता है:

- **डेटा लोडिंग** आपके मौजूदा `.txt`, `.pdf`, `.csv`, `.md` और `.docx` डेटा को सीधे इंजेस्ट करें
- **डेटा इंडेक्स** अपने डेटा को इंटरमीडिएट प्रतिष्ठानों में संरचित करें जो LLMs के लिए सरल और प्रदर्शनशील होते हैं।
- **इंजन** आपके डेटा तक प्राकृतिक भाषा पहुंच प्रदान करते हैं। उदाहरण के लिए:
  - क्वेरी इंजन ज्ञान-वृद्धि युक्त आउटपुट के लिए शक्तिशाली रिट्रीवल इंटरफेस होते हैं।
  - चैट इंजन आपके डेटा के साथ "आगे-पीछे" बहस करने वाले बहु-संदेश, संवादात्मक इंटरफेस होते हैं।

"

## 👨‍👩‍👧‍👦 LlamaIndex किसके लिए है?

LlamaIndex.TS जावास्क्रिप्ट और TypeScript के साथ LLM ऐप्स बनाने वाले लोगों के लिए एक महत्वपूर्ण सेट के उपकरण प्रदान करता है।

हमारा हाई-लेवल API शुरुआती उपयोगकर्ताओं को LlamaIndex.TS का उपयोग डेटा को इंजेस्ट और क्वेरी करने के लिए करने की अनुमति देता है।

अधिक जटिल एप्लिकेशनों के लिए, हमारे लोअर-लेवल API उन्नत उपयोगकर्ताओं को अपनी आवश्यकताओं के अनुसार किसी भी मॉड्यूल - डेटा कनेक्टर, इंडेक्स, रिट्रीवर्स और क्वेरी इंजन्स को कस्टमाइज़ और विस्तारित करने की अनुमति देते हैं।

## शुरू करना

`npm install llamaindex`

हमारी दस्तावेज़ी में [स्थापना निर्देश](./installation.md) और [स्टार्टर ट्यूटोरियल](./starter.md) शामिल हैं, जिनका उपयोग करके आप अपना पहला एप्लिकेशन बना सकते हैं।

एक बार जब आप शुरू हो जाएं, [उच्च स्तरीय अवधारणाएँ](./concepts.md) में LlamaIndex की मॉड्यूलर आर्किटेक्चर का अवलोकन है। अधिक हैंड्स-ऑन प्रैक्टिकल उदाहरणों के लिए, हमारे [एंड-टू-एंड ट्यूटोरियल](./end_to_end.md) को देखें।

"

## 🗺️ पारिस्थितिकी

डाउनलोड या सहयोग करने के लिए, LlamaIndex को यहां ढूंढें:

- Github: https://github.com/run-llama/LlamaIndexTS
- NPM: https://www.npmjs.com/package/llamaindex

"

## समुदाय

मदद चाहिए? कोई सुविधा सुझाव है? LlamaIndex समुदाय में शामिल हों:

- Twitter: https://twitter.com/llama_index
- Discord https://discord.gg/dGcwcsnxhU