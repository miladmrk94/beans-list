import * as XLSX from 'xlsx';

export function FileUploader({ onUpload, wordsList, onClear }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = data.map((row, index) => ({
        id: index + 1,
        english: row.english || row.English || '',
        farsi: row.farsi || row.Farsi || ''
      }));

      onUpload(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-2xl mx-auto mb-6 sm:mb-8 bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <label className="block text-sm font-medium text-violet-400">
          Import Words from Excel
        </label>
        {wordsList.length > 0 && (
          <button
            onClick={onClear}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full
                     text-sm font-medium transition-colors duration-200"
          >
            Clear All Words
          </button>
        )}
      </div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-500 file:text-white
          hover:file:bg-violet-600
          cursor-pointer"
      />
    </div>
  );
}