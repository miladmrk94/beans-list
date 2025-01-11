import { useEffect, useState } from 'react';
import { useIndexedDBStore } from 'use-indexeddb';
import { useInitializeDB } from './hooks/useInitializeDB';
import { useWordsManager } from "./hooks/useWordsManager";
import { usePronunciation } from "./hooks/usePronunciation";
import { WordSorter } from "./components/WordSorter";
import { FileUploader } from "./components/FileUploader";
import { WordsList } from "./components/WordsList";
import Header from "./components/header";
import NavigationBar from "./components/NavigationBar";
import VocabularyAssistant from "./components/VocabularyAssistant";

function App() {
  const [words, setWords] = useState([]);
  useInitializeDB();
  const { getAll } = useIndexedDBStore("vocabulary");

  useEffect(() => {
    const loadWords = async () => {
      const storedWords = await getAll();
      setWords(storedWords);
    };
    loadWords();
  }, [getAll]);

  const handleUpdateWord = async (updatedWord) => {
    setWords(prevWords => {
      const newWords = prevWords.filter(w => w.id !== updatedWord.id);
      return [...newWords, updatedWord].sort((a, b) => a.id - b.id);
    });
  };

  const {
    wordsList,
    setWordsList,
    hiddenMeanings,
    setHiddenMeanings,
    toggleMeaning,
    clearWordsList,
    updateWord
  } = useWordsManager();

  const { speakWord } = usePronunciation();
  const [sortType, setSortType] = useState("default");

  const handleFileUpload = (formattedData) => {
    setWordsList(formattedData);
    localStorage.setItem("wordsList", JSON.stringify(formattedData));

    const newHiddenStates = formattedData.reduce((acc, word) => {
      acc[word.id] = true;
      return acc;
    }, {});
    setHiddenMeanings(newHiddenStates);
    localStorage.setItem("hiddenMeanings", JSON.stringify(newHiddenStates));
  };

  const getSortedWords = () => {
    const words = [...wordsList];
    switch (sortType) {
      case 'newest':
        return words.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      case 'oldest':
        return words.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
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
    <div className=" max-w-md mx-auto bg-[#323841] ">
      <Header />
      <div className="container mx-auto  my-14 sm:p-4">
        <FileUploader
          onUpload={handleFileUpload}
          wordsList={wordsList}
          onClear={clearWordsList}
        />
        {/* <VocabularyAssistant/> */}
        <WordSorter sortType={sortType} setSortType={setSortType} />
        <WordsList
          words={getSortedWords()}
          hiddenMeanings={hiddenMeanings}
          onToggleMeaning={toggleMeaning}
          onSpeak={speakWord}
          onUpdateWord={handleUpdateWord}
        />
      </div>
      <NavigationBar />
    </div>
  );
}

export default App;
