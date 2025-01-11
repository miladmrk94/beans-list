import { useIndexedDBStore } from "use-indexeddb";
import * as XLSX from 'xlsx';

export function FileUploader({ onUpload, onClear }) {
  const { add, deleteAll } = useIndexedDBStore("vocabulary");

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          console.log("File loaded, processing data..."); // Debug log

          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          console.log("Parsed Excel data:", data); // Debug log

          const formattedData = data.map(row => ({
            english: row.english || row.English || '',
            farsi: row.farsi || row.Farsi || '',
            addedAt: Date.now()
          }));

          console.log("Formatted data:", formattedData); // Debug log

          // Add all words in a single batch operation
          try {
            const addPromises = formattedData.map(word => add(word));
            const ids = await Promise.all(addPromises);
            const addedWords = formattedData.map((word, index) => ({
              ...word,
              id: ids[index]
            }));
            console.log("Words added to IndexedDB:", addedWords); // Debug log
            onUpload(addedWords);
          } catch (error) {
            console.error("Error adding words batch:", error);
          }
        } catch (error) {
          console.error("Error processing file:", error);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
    }
  };

  const handleClear = async () => {
    try {
      await deleteAll();
      onClear();
    } catch (error) {
      console.error("Error clearing database:", error);
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center mb-8">
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
        className="file-input file-input-bordered w-full max-w-xs"
      />
      <button onClick={handleClear} className="btn btn-error">
        Clear All
      </button>
    </div>
  );
}