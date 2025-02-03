import { useState, useEffect, memo } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // },
  dangerouslyAllowBrowser: true, // Only use this for development/demo purposes
});

const VocabularyAssistant = memo(({ inputWord }) => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent("");
    setIsGenerating(false);
  }, [inputWord]);

  const handleGenerate = async () => {
    if (!inputWord) return;
    setLoading(true);
    setIsGenerating(true);
    setOutput(null);

    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: `
You are an advanced English language assistant specializing in vocabulary explanation and linguistic analysis. Your task is to analyze a given word or sentence and complete the following details:

Explanation: Provide a very simple and concise explanation of the word or sentence's meaning in a maximum of 3 lines.
IPA Transcription: Include its phonetic transcription in the International Phonetic Alphabet (IPA).
Phonetic Transcription: Provide the pronunciation in English phonetic alphabet.
Synonyms: List up to 5 synonyms (if applicable).
Antonyms: List up to 5 antonyms (if applicable).
Example Sentences: Write up to 3 short and simple example sentences showcasing the most common usage of the word or sentence.
Format:
Provide your response in the following JavaScript object structure:
javascript Copy code
{
  "word": "example_word_or_sentence",
  "explanation": "A simple explanation of the word or sentence in 3 lines maximum.",
  "ipa": "IPA_transcription",
  "Pronounce": "Persian_phonetic_transcription",
  "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
  "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"],
  "example_sentences": [
    "Example sentence 1.",
    "Example sentence 2.",
    "Example sentence 3."
  ]
}
            
            `,
          },
          {
            role: "user",
            content: inputWord,
          },
        ],
        temperature: 0.7,
        // max_tokens:500,
        response_format: { type: "json_object" },
      });
      const result = completion.choices[0].message.content;
      const parsedResult = JSON.parse(result);
      console.log("KHOOJI===>", typeof(parsedResult), parsedResult);

      const contentData = Array.isArray(parsedResult) ? parsedResult[0] : parsedResult;
      setContent(contentData);
      setIsGenerating(false);
      setOutput(result);
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while generating the response.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl w-full flex flex-col gap-6">
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleGenerate}
        className={`w-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          text-lg font-medium py-4 rounded-xl border-2 border-indigo-500/20
          bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600
          shadow-lg hover:shadow-xl hover:-translate-y-0.5
          ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
        aria-label={isGenerating ? "Generating content" : "Generate vocabulary details"}
      >
        <div className="relative flex items-center justify-center gap-3">
          {isGenerating ? (
            <>
              <div className="h-6 w-6 border-[3px] border-white/30 border-t-white animate-spin rounded-full" />
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Crafting Your Learning Guide...
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2 group">
              <SparklesIcon className="w-6 h-6 text-amber-300 transition-transform group-hover:rotate-12" />
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Generate Smart Study Notes
              </span>
            </div>
          )}
        </div>
      </button>
      {content && !loading && (
        <div className="flex flex-col gap-3 h-[300px] overflow-y-auto p-4">
          <div className="space-y-2">
            <h4 className="font-medium">Additional Information</h4>
            <div className="bg-base-200 rounded-lg p-3 ">
              <p className="text-sm flex flex-col">
                <span className="font-extrabold text-indigo-400">
                  explanation:
                </span>{" "}
                <span>{content.explanation}</span>
              </p>
            </div>
            <div className="bg-base-200 rounded-lg p-3 ">
              <p className="text-sm flex flex-col">
                <span className="font-extrabold text-indigo-400">
                  Part of speech:
                </span>{" "}
                <span>{content.ipa}</span>
              </p>
            </div>
          </div>

          <div className="bg-base-200 rounded-lg p-3 space-y-1">
            <span className="font-extrabold text-indigo-400">
              Examples in Sentences:
            </span>{" "}
            <ul className="list-disc list-inside space-y-1 text-sm text-base-content/80">
              {content.example_sentences.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
});

VocabularyAssistant.displayName = "VocabularyAssistant";

export default VocabularyAssistant;
