export function WordSorter({ sortType, setSortType }) {
  const sortButtons = [
    { type: 'default', label: 'Default' },
    { type: 'alpha', label: 'A to Z' },
    { type: 'alphaReverse', label: 'Z to A' },
    { type: 'length', label: 'Shortest First' },
    { type: 'lengthReverse', label: 'Longest First' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4  ">
      <label className="block text-sm font-medium text-success mb-2">
        Sort Words By:
      </label>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {sortButtons.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setSortType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300
              ${sortType === type 
                ? 'bg-success text-white' 
                : ' bg-[#25292e] bg-opacity-30 text-gray-300 hover:bg-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 