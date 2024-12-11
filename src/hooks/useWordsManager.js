import { useState, useEffect } from 'react';

export function useWordsManager() {
  const [wordsList, setWordsList] = useState(() => {
    const savedWords = localStorage.getItem('wordsList');
    return savedWords ? JSON.parse(savedWords) : [];
  });

  const [hiddenMeanings, setHiddenMeanings] = useState(() => {
    const savedHiddenStates = localStorage.getItem('hiddenMeanings');
    if (savedHiddenStates) {
      return JSON.parse(savedHiddenStates);
    }
    return wordsList.reduce((acc, word) => {
      acc[word.id] = true;
      return acc;
    }, {});
  });

  useEffect(() => {
    const savedHiddenStates = localStorage.getItem('hiddenMeanings');
    if (savedHiddenStates) {
      setHiddenMeanings(JSON.parse(savedHiddenStates));
    }
  }, []);

  const toggleMeaning = (id) => {
    const newHiddenMeanings = {
      ...hiddenMeanings,
      [id]: !hiddenMeanings[id]
    };
    setHiddenMeanings(newHiddenMeanings);
    localStorage.setItem('hiddenMeanings', JSON.stringify(newHiddenMeanings));
  };

  const clearWordsList = () => {
    if (window.confirm('Are you sure you want to delete all words? This cannot be undone.')) {
      setWordsList([]);
      localStorage.removeItem('wordsList');
      setHiddenMeanings({});
      localStorage.removeItem('hiddenMeanings');
    }
  };

  return {
    wordsList,
    setWordsList,
    hiddenMeanings,
    setHiddenMeanings,
    toggleMeaning,
    clearWordsList
  };
} 