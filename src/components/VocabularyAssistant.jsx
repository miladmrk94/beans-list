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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setContent("");
    setShowContent(false);
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
      console.log("KHOOJI===>", result, parsedResult);

      // setContent(parsedResult[0]);
      // setIsGenerating(false);
      // setShowContent(true);
      // setOutput(result);
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while generating the response.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md flex flex-col gap-4">
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleGenerate}
        className={`w-full shadow__btn ${
          isGenerating ? "shadow__btn__active" : ""
        } text-sm`}
      >
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>✨ Generating Magic ...</span>
            </>
          ) : (
            <>
              <span>✨ AI Generate More Details </span>
            </>
          )}
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ease-out ${
              showContent ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          ></div>
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

      <style jsx global>{`
        .shadow__btn {
          padding: 10px 20px;
          border: none;
          color: #fff;
          border-radius: 7px;
          font-weight: 500;
          transition: 0.5s;
          transition-property: box-shadow;
        }

        .shadow__btn {
          background: rgb(0, 140, 255);
          box-shadow: 0 0 25px rgb(0, 140, 255);
        }

        .shadow__btn__active {
          box-shadow: 0 0 5px rgb(0, 140, 255), 0 0 25px rgb(0, 140, 255),
            0 0 30px rgb(0, 140, 255), 0 0 60px rgb(0, 140, 255);
        }
      `}</style>
    </div>
  );
});

VocabularyAssistant.displayName = "VocabularyAssistant";

export default VocabularyAssistant;
