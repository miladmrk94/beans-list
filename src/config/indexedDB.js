export const idbConfig = {
  databaseName: "beans-db",
  version: 1,
  stores: [
    {
      name: "vocabulary",
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "english", keyPath: "english", options: { unique: false } },
        { name: "farsi", keyPath: "farsi", options: { unique: false } },
        { name: "addedAt", keyPath: "addedAt", options: { unique: false } },
      ],
    },
  ],
}; 