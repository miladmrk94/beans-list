   // src/App.jsx
   import { useState, useEffect } from 'react'
   import reactLogo from './assets/react.svg'
   import appLogo from '/favicon.svg'
   import PWABadge from './PWABadge.jsx'
   import './App.css'
   import * as XLSX from 'xlsx'

   function App() {
     // Initialize wordsList from localStorage or use default list
     const [wordsList, setWordsList] = useState(() => {
       const savedWords = localStorage.getItem('wordsList');
       return savedWords ? JSON.parse(savedWords) : [

       ];
     });

     // State for hidden meanings
     const [hiddenMeanings, setHiddenMeanings] = useState({})

     // Load hidden states from localStorage on component mount
     useEffect(() => {
       const savedHiddenStates = localStorage.getItem('hiddenMeanings')
       if (savedHiddenStates) {
         setHiddenMeanings(JSON.parse(savedHiddenStates))
       }
     }, [])

     // Toggle word visibility and save to localStorage
     const toggleMeaning = (id) => {
       const newHiddenMeanings = {
         ...hiddenMeanings,
         [id]: !hiddenMeanings[id]
       }
       setHiddenMeanings(newHiddenMeanings)
       localStorage.setItem('hiddenMeanings', JSON.stringify(newHiddenMeanings))
     }

     // Add function to handle text-to-speech
     const speakWord = async (word) => {
       try {
         // Fetch pronunciation from Free Dictionary API
         const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
         const data = await response.json();
         
         // Look specifically for US pronunciation
         const audioUrl = data[0]?.phonetics
           ?.find(p => p.audio && (
             p.audio.includes('us.mp3') || // Check for US audio files
             p.audio.includes('-us-') ||
             p.audio.includes('american')
           ))?.audio;
         
         if (audioUrl) {
           // Create and play audio
           const audio = new Audio(audioUrl);
           audio.play();
         } else {
           // Fallback to American voice speech synthesis
           const utterance = new SpeechSynthesisUtterance(word);
           utterance.lang = 'en-US';
           const voices = window.speechSynthesis.getVoices();
           // Specifically look for an American English voice
           const americanVoice = voices.find(voice => 
             voice.lang === 'en-US' && 
             (voice.name.includes('US') || voice.name.includes('American'))
           );
           if (americanVoice) {
             utterance.voice = americanVoice;
           }
           utterance.pitch = 1.0;
           utterance.rate = 0.9;
           window.speechSynthesis.speak(utterance);
         }
       } catch (error) {
         console.error('Error fetching pronunciation:', error);
         // Fallback with American voice
         const utterance = new SpeechSynthesisUtterance(word);
         utterance.lang = 'en-US';
         window.speechSynthesis.speak(utterance);
       }
     };

     // Update file handling function to save to localStorage
     const handleFileUpload = (e) => {
       const file = e.target.files[0];
       const reader = new FileReader();

       reader.onload = (event) => {
         const workbook = XLSX.read(event.target.result, { type: 'binary' });
         const sheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[sheetName];
         const data = XLSX.utils.sheet_to_json(worksheet);

         // Convert Excel data to our format
         const formattedData = data.map((row, index) => ({
           id: index + 1,
           english: row.english || row.English || '',
           farsi: row.farsi || row.Farsi || ''
         }));

         // Save to state and localStorage
         setWordsList(formattedData);
         localStorage.setItem('wordsList', JSON.stringify(formattedData));
       };

       reader.readAsBinaryString(file);
     };

     // Add sorting state
     const [sortType, setSortType] = useState('default');

     // Sorting function
     const getSortedWords = () => {
       const words = [...wordsList];
       
       switch (sortType) {
         case 'alpha':
           return words.sort((a, b) => 
             a.english.localeCompare(b.english)
           );
         case 'alphaReverse':
           return words.sort((a, b) => 
             b.english.localeCompare(a.english)
           );
         case 'length':
           return words.sort((a, b) => 
             a.english.length - b.english.length
           );
         case 'lengthReverse':
           return words.sort((a, b) => 
             b.english.length - a.english.length
           );
         default:
           return words;
       }
     };

     // Add clear list function
     const clearWordsList = () => {
       if (window.confirm('Are you sure you want to delete all words? This cannot be undone.')) {
         setWordsList([]);
         localStorage.removeItem('wordsList');
         setHiddenMeanings({});
         localStorage.removeItem('hiddenMeanings');
       }
     };

     return (
       <div className="min-h-screen bg-gray-900 text-gray-100">
         <div className="container mx-auto p-4">
           <header className="mb-8 text-center">
             <h1 className="text-4xl font-bold mb-2 text-violet-400">English-Farsi Dictionary</h1>
             <p className="text-gray-400">Learn and practice vocabulary with ease</p>
           </header>
           
           {/* File upload and clear list section */}
           <div className="max-w-2xl mx-auto mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
             <div className="flex justify-between items-center mb-4">
               <label className="block text-sm font-medium text-violet-400">
                 Import Words from Excel
               </label>
               {wordsList.length > 0 && (
                 <button
                   onClick={clearWordsList}
                   className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full
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

           {/* Sorting controls */}
           <div className="max-w-2xl mx-auto mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
             <label className="block text-sm font-medium text-violet-400 mb-2">
               Sort Words By:
             </label>
             <div className="flex flex-wrap gap-2">
               <button
                 onClick={() => setSortType('default')}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                   ${sortType === 'default' 
                     ? 'bg-violet-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
               >
                 Default
               </button>
               <button
                 onClick={() => setSortType('alpha')}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                   ${sortType === 'alpha' 
                     ? 'bg-violet-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
               >
                 A to Z
               </button>
               <button
                 onClick={() => setSortType('alphaReverse')}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                   ${sortType === 'alphaReverse' 
                     ? 'bg-violet-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
               >
                 Z to A
               </button>
               <button
                 onClick={() => setSortType('length')}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                   ${sortType === 'length' 
                     ? 'bg-violet-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
               >
                 Shortest First
               </button>
               <button
                 onClick={() => setSortType('lengthReverse')}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                   ${sortType === 'lengthReverse' 
                     ? 'bg-violet-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
               >
                 Longest First
               </button>
             </div>
           </div>

           {/* Words list - update to use sorted words */}
           <div className="max-w-2xl mx-auto">
             <div className="grid grid-cols-3 gap-4 mb-4 text-center font-medium text-violet-400">
               <div>English</div>
               <div>Pronunciation</div>
               <div>Farsi</div>
             </div>
             
             {getSortedWords().map((word) => (
               <div 
                 key={word.id} 
                 className="mb-3 bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all
                           border border-gray-700 hover:border-violet-500"
               >
                 <div className="grid grid-cols-3 gap-4 items-center text-center">
                   <span className="font-medium text-lg">{word.english}</span>
                   <button
                     onClick={() => speakWord(word.english)}
                     className="mx-auto p-3 rounded-full hover:bg-violet-500/20 text-violet-400
                              transition-colors duration-200"
                     aria-label="Play pronunciation"
                   >
                     🔊
                   </button>
                   <span 
                     className="cursor-pointer px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600
                              transition-colors duration-200"
                     onClick={() => toggleMeaning(word.id)}
                   >
                     {hiddenMeanings[word.id] ? (
                       <span className="text-violet-400">👁️ Show</span>
                     ) : (
                       <span className="text-gray-100">{word.farsi}</span>
                     )}
                   </span>
                 </div>
               </div>
             ))}
           </div>

           {/* Empty state */}
           {wordsList.length === 0 && (
             <div className="text-center text-gray-400 mt-8">
               <p className="text-lg">No words added yet.</p>
               <p className="text-sm">Upload an Excel file to get started.</p>
             </div>
           )}
         </div>
       </div>
     )
   }

   export default App