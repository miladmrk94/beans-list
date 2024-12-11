export function WordSorter({ sortType, setSortType }) {
  const sortButtons = [
    { type: 'default', label: 'Default' },
    { type: 'alpha', label: 'A to Z' },
    { type: 'alphaReverse', label: 'Z to A' },
    { type: 'length', label: 'Shortest First' },
    { type: 'lengthReverse', label: 'Longest First' },
  ];

  return (
    <div className="max-w-2xl mx-auto mb-6 bg-gray-800/50 p-4 rounded-lg shadow-lg">
      <label className="block text-sm font-medium text-violet-400 mb-2">
        Sort Words By:
      </label>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {sortButtons.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setSortType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${sortType === type 
                ? 'bg-violet-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 