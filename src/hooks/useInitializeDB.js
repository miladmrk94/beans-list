import { useEffect } from 'react';
import setupIndexedDB from 'use-indexeddb';
import { idbConfig } from '../config/indexedDB';

export const useInitializeDB = () => {
  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => console.log("IndexedDB initialized successfully"))
      .catch(e => console.error("IndexedDB initialization error:", e));
  }, []);
}; 