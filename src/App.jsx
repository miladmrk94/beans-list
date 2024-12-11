import { useState } from 'react';
import { useWordsManager } from './hooks/useWordsManager';
import { usePronunciation } from './hooks/usePronunciation';
import { WordSorter } from './components/WordSorter';
import { FileUploader } from './components/FileUploader';
import { WordsList } from './components/WordsList';
import './App.css';

function App() {
  const { 
    wordsList, 
    setWordsList, 
    hiddenMeanings, 
    setHiddenMeanings, 
    toggleMeaning, 
    clearWordsList 
  } = useWordsManager();
  
  const { speakWord } = usePronunciation();
  const [sortType, setSortType] = useState('default');

  const handleFileUpload = (formattedData) => {
    setWordsList(formattedData);
    localStorage.setItem('wordsList', JSON.stringify(formattedData));

    const newHiddenStates = formattedData.reduce((acc, word) => {
      acc[word.id] = true;
      return acc;
    }, {});
    setHiddenMeanings(newHiddenStates);
    localStorage.setItem('hiddenMeanings', JSON.stringify(newHiddenStates));
  };

  const getSortedWords = () => {
    const words = [...wordsList];
    switch (sortType) {
      case 'alpha':
        return words.sort((a, b) => a.english.localeCompare(b.english));
      case 'alphaReverse':
        return words.sort((a, b) => b.english.localeCompare(a.english));
      case 'length':
        return words.sort((a, b) => a.english.length - b.english.length);
      case 'lengthReverse':
        return words.sort((a, b) => b.english.length - a.english.length);
      default:
        return words;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto p-2 sm:p-4">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-violet-400">English-Farsi Dictionary</h1>
          <p className="text-gray-400">Learn and practice vocabulary with ease</p>
        </header>
        
        <FileUploader 
          onUpload={handleFileUpload}
          wordsList={wordsList}
          onClear={clearWordsList}
        />
        
        <WordSorter 
          sortType={sortType}
          setSortType={setSortType}
        />
        
        <WordsList 
          words={getSortedWords()}
          hiddenMeanings={hiddenMeanings}
          onToggleMeaning={toggleMeaning}
          onSpeak={speakWord}
        />
      </div>
    </div>
  );
}

export default App;