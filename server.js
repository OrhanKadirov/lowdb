import express from "express";
const app = express();

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "./data/db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

const setUpDb = async (db) => {
  const defaultData = {
    cities: [
      {
        id: 1,
        name: "Hamburg",
        inhabitans: 1800000,
      },
      {
        id: 2,
        name: "Köln",
        inhabitans: 1086000,
      },
      {
        id: 3,
        name: "Berlin",
        inhabitans: 6200000,
      },
    ],
  };
  if (db.data === null) {
    db.data = defaultData;
    await db.write();
  }
};

setUpDb(db);

app.get("/", async (req, res) => {
  await db.read();
  res.send(db.data);
});

app.listen(3000, function () {
  console.log("Listening on port: http://localhost:3000");
});
