import { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

function extractTextAsObject(apiResponse) {
  const text = apiResponse.candidates[0].content.parts[0].text;
  const jsonText = text
    .slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
    .trim();
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

const VocabularyAssistant = ({ inputWord }) => {
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
      const response = await fetch("https://beansproxy.onrender.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: inputWord }),
      });

      const result = await response.json();
      console.log(extractTextAsObject(result));

      setContent(extractTextAsObject(result));
      setIsGenerating(false);
      setShowContent(true);

      // بررسی و نمایش پاسخ
      setOutput(result.response ? result.response.text : "No result received.");
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
               return<li key={index}>{item}</li>;
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
};

export default VocabularyAssistant;
