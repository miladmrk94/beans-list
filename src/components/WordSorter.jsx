export function WordSorter({ sortType, setSortType }) {
  const sortButtons = [
    { type: 'default', label: 'Default' },
    { type: 'newest', label: 'Newest First' },
    { type: 'oldest', label: 'Oldest First' },
    { type: 'alpha', label: 'A to Z' },
    { type: 'alphaReverse', label: 'Z to A' },
    { type: 'length', label: 'Shortest First' },
    { type: 'lengthReverse', label: 'Longest First' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex px-2 py-2 flex-row gap-2 w-full overflow-x-auto scrollbar-hidden whitespace-nowrap bg-[#374151]">
        {sortButtons.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setSortType(type)}
            className={`px-5 py-2  rounded-full text-sm font-medium transition-colors duration-300
              ${sortType === type 
                ? 'bg-success text-white' 
                : 'bg-[#25292e] bg-opacity-30 text-gray-300 hover:bg-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 