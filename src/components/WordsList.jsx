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
          className="mb-2 bg-gray-800 rounded-lg p-4 flex items-center justify-between
                    hover:bg-gray-750 transition-all"
        >
          <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <span className="text-gray-100 text-lg">{word.english}</span>
            
            <button
              onClick={() => onSpeak(word.english)}
              className="flex items-center justify-center w-8 h-8 opacity-60 hover:opacity-100"
              aria-label="Play pronunciation"
            >
              <span className="text-2xl">🔊</span>
            </button>

            <span className="text-gray-100 text-lg text-right"  onClick={() => onToggleMeaning(word.id)}>{hiddenMeanings[word.id] ? (
                <span className="text-violet-400">👁️</span>
              ) : (
                <span className="text-gray-100">{word.farsi}</span>
              )}</span>
          </div>

       
        </div>
      ))}
    </div>
  );
} 