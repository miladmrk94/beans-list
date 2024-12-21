import { useState } from "react";
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
    <div className="max-w-md ">
      <h3 className="font-bold text-lg my-2">✨ AI Generated</h3>

      <button
        type="button"
        disabled={isGenerating}
        onClick={handleGenerate}
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 px-4 py-1.5 text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 flex translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000">
          <div className="h-full w-1/3 rotate-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Sparkles background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute h-4 w-4 rounded-full bg-white animate-sparkle"
            style={{ left: "10%", top: "30%" }}
          />
          <div
            className="absolute h-4 w-4 rounded-full bg-white animate-sparkle"
            style={{ left: "70%", top: "60%" }}
          />
          <div
            className="absolute h-4 w-4 rounded-full bg-white animate-sparkle"
            style={{ left: "40%", top: "50%" }}
          />
        </div>

        {/* Button content */}
        <div className="relative flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Generating Magic ✨...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              <span>Generate More Meanings ✨</span>
            </>
          )}
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ease-out ${
              showContent ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          ></div>
        </div>
      </button>
      <div>
     {JSON.stringify(content)},
    
      </div>

      <style jsx global>{`
        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.5);
          }
        }
        .animate-sparkle {
          animation: sparkle 2s infinite;
          animation-delay: var(--delay, 0ms);
        }
        .animate-sparkle:nth-child(2) {
          --delay: 400ms;
        }
        .animate-sparkle:nth-child(3) {
          --delay: 800ms;
        }
      `}</style>
    </div>
  );
};

export default VocabularyAssistant;
