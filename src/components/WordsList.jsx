import {
  EllipsisHorizontalIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { EyeDropperIcon } from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";
import VocabularyAssistant from "./VocabularyAssistant";
import { useIndexedDBStore } from "use-indexeddb";
import { useVirtualizer } from '@tanstack/react-virtual';
import { debounce } from 'lodash';

const ITEMS_PER_PAGE = 50;

export function WordsList({
  words,
  hiddenMeanings,
  onToggleMeaning,
  onSpeak,
  onUpdateWord,
}) {
  const { add, update, getAll } = useIndexedDBStore("vocabulary");
  const [editingWord, setEditingWord] = useState(null);
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [vocabularyKey, setVocabularyKey] = useState(0);
  const parentRef = useRef(null);
  const [page, setPage] = useState(1);
  const [loadedWords, setLoadedWords] = useState([]);

  useEffect(() => {
    setLoadedWords(words.slice(0, page * ITEMS_PER_PAGE));
  }, [words, page]);

  const rowVirtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // height of each row (14 * 4)
    overscan: 5
  });

  const debouncedHandleWordClick = debounce((word) => {
    setEditingWord(word);
    setVocabularyKey((prev) => prev + 1);
    document.getElementById("my_modal_3").showModal();
  }, 300);

  const handleWordClick = (word) => {
    debouncedHandleWordClick(word);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedWord = {
      ...editingWord,
      english: e.target.english.value,
      farsi: e.target.farsi.value,
    };
    await update(updatedWord);
    onUpdateWord(updatedWord);
    document.getElementById("my_modal_3").close();
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    const newWord = {
      english: e.target.english.value,
      farsi: e.target.farsi.value,
      addedAt: Date.now(),
    };
    const id = await add(newWord);
    onUpdateWord({ ...newWord, id });
    document.getElementById("my_modal_3").close();
    e.target.reset();
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && loadedWords.length < words.length) {
      setPage(prev => prev + 1);
    }
  };

  if (words.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p className="text-lg">No words added yet.</p>
        <p className="text-sm">Upload an Excel file to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto ">
      <div className=" pb-3 bg-[#374151] px-2">
        <button
          onClick={() => {
            setEditingWord(null);
            document.getElementById("my_modal_3").showModal();
          }}
          className="w-full  px-4 py-2 bg-success hover:bg-success/80 text-white rounded-lg
                   text-sm font-medium transition-colors duration-200"
        >
          Add New Word
        </button>
      </div>
      <div 
        ref={parentRef}
        className="rounded-xl bg-[#374151] overflow-auto mx-3"
        style={{ height: 'calc(100vh - 250px)' }} // Adjust based on your needs
        onScroll={handleScroll}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const word = words[virtualRow.index];
            return (
              <div
                key={word.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="p-2 flex items-center justify-between hover:bg-gray-750 transition-all border-t-[1px] border-white border-opacity-5 h-14 overflow-hidden"
              >
                <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <span
                    onClick={() => handleWordClick(word)}
                    className="text-gray-100 text-sm text-left cursor-pointer hover:underline"
                  >
                    {word.english}
                  </span>

                  <button
                    onClick={() => onSpeak(word.english)}
                    className="flex items-center justify-center w-8 h-8 opacity-60 hover:opacity-100 group"
                    aria-label="Play pronunciation"
                  >
                    <SpeakerWaveIcon className="size-5 transition-transform duration-200 group-active:scale-90 hover:scale-110" />
                  </button>

                  <div
                    className="text-gray-100 text-sm flex justify-end text-right"
                    onClick={() => onToggleMeaning(word.id)}
                  >
                    {hiddenMeanings[word.id] ? (
                      <EllipsisHorizontalIcon className="size-5" />
                    ) : (
                      <span className="text-gray-100">{word.farsi}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-md p-0 overflow-hidden">
          <div className="p-4 border-b border-base-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingWord ? "Edit Word" : "Add New Word"}
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => document.getElementById("my_modal_3").close()}
              >
                X
              </button>
            </div>
          </div>

          <form
            onSubmit={editingWord ? handleSave : handleAddWord}
            className="p-4 space-y-4"
          >
            <div className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Word</span>
                </label>
                <input
                  type="text"
                  name="english"
                  className="input input-bordered w-full"
                  defaultValue={editingWord?.english}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Translation</span>
                </label>
                <input
                  type="text"
                  name="farsi"
                  className="input input-bordered w-full font-farsi"
                  defaultValue={editingWord?.farsi}
                  dir="rtl"
                />
              </div>

              <div className="  rounded-lg mt-4">
                <VocabularyAssistant
                  key={vocabularyKey}
                  inputWord={editingWord?.english}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                className="btn flex-1"
                onClick={() => {
                  document.getElementById("my_modal_3").close();
                  setVocabularyKey((prev) => prev + 1);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1 ">
                {editingWord ? "Save Changes" : "Add Word"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
