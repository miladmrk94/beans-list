import { EyeIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { EyeDropperIcon } from "@heroicons/react/24/solid";

export function WordsList({ words, hiddenMeanings, onToggleMeaning, onSpeak }) {
  if (words.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p className="text-lg">No words added yet.</p>
        <p className="text-sm">Upload an Excel file to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {words.map((word) => (
        <div
          key={word.id}
          className=" bg-[rgb(65, 65, 65)] p-2 flex items-center justify-between
                    hover:bg-gray-750 transition-all border-t-[1px] border-white border-opacity-5 h-14 overflow-hidden"
        >
          <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <span className="text-gray-100 text-sm text-left">{word.english}</span>

            <button
              onClick={() => onSpeak(word.english)}
              className="flex items-center justify-center w-8 h-8 opacity-60 hover:opacity-100 group"
              aria-label="Play pronunciation"
            >
              <SpeakerWaveIcon className="size-5 transition-transform duration-200 group-active:scale-90 hover:scale-110" />
            </button>

            <div
              className="text-gray-100 text-sm flex justify-end text-right"
              onClick={() => onToggleMeaning(word.id)}
            >
              {hiddenMeanings[word.id] ? (
                <EllipsisHorizontalIcon className="size-5" />
              ) : (
                <span className="text-gray-100">{word.farsi}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
