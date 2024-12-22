import {
  EllipsisHorizontalIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { EyeDropperIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import VocabularyAssistant from "./VocabularyAssistant";

export function WordsList({ words, hiddenMeanings, onToggleMeaning, onSpeak, onUpdateWord }) {
  const [editingWord, setEditingWord] = useState(null);

  const handleWordClick = (word) => {
    setEditingWord(word);
    document.getElementById("my_modal_3").showModal();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedWord = {
      ...editingWord,
      english: e.target.english.value,
      farsi: e.target.farsi.value,
    };
    onUpdateWord(updatedWord);
    document.getElementById("my_modal_3").close();
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    const newWord = {
      id: Math.max(...words.map(w => w.id), 0) + 1,
      english: e.target.english.value,
      farsi: e.target.farsi.value,
      addedAt: Date.now()
    };
    onUpdateWord(newWord);
    document.getElementById("my_modal_3").close();
    e.target.reset();
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
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => {
          setEditingWord(null);
          document.getElementById("my_modal_3").showModal();
        }}
        className="w-full mb-4 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-lg
                   text-sm font-medium transition-colors duration-200"
      >
        Add New Word
      </button>

      {words.map((word) => (
        <div
          key={word.id}
          className=" bg-[rgb(65, 65, 65)] p-2 flex items-center justify-between
                    hover:bg-gray-750 transition-all border-t-[1px] border-white border-opacity-5 h-14 overflow-hidden"
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
      ))}

      <dialog id="my_modal_3" className="modal modal-bottom">
        <div className="modal-box p-2">
          <form onSubmit={editingWord ? handleSave : handleAddWord}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2">
              {editingWord ? "Edit Word" : "Add New Word"}
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2 ">
                <label className="label">
                  <span className="label-text w-14">English</span>
                </label>
                <input
                  type="text"
                  name="english"
                  className="input input-bordered w-full h-9"
                  defaultValue={editingWord?.english}
                />
              </div>
              <div className="flex gap-2 ">
                <label className="label">
                  <span className="label-text w-14">Farsi</span>
                </label>
                <input
                  type="text"
                  name="farsi"
                   className="input input-bordered w-full h-9"
                  defaultValue={editingWord?.farsi}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary p-0 m-0 h-9 min-h-9 w-full">Save</button>
              </div>
            </div>
            <div>
             <VocabularyAssistant inputWord={editingWord?.english}/>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
