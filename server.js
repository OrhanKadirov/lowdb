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

  await db.read();

  if (db.data === null) {
    db.data = defaultData;
    await db.write();
  }
};

setUpDb(db);
app.use(express.json());

app.get("/", async (req, res) => {
  await db.read();
  res.send(db.data);
});

app.get("/cities", async (req, res) => {
  await db.read();
  res.send(db.data.cities);
});

app.get("/cities/:name", async (req, res) => {
  await db.read();
  const city = db.data.cities.find((city) => city.name === req.params.name);
  res.send(city);
});

app.patch("/cities/:id", async (req, res) => {
  await db.read();
  const updateData = req.body;
  let cityIndex = db.data.cities.findIndex(
    (city) => city.id === parseInt(req.params.id)
  );
  console.log(cityIndex);
  if (cityIndex > -1) {
    db.data.cities[cityIndex] = { ...db.data.cities[cityIndex], ...updateData };
    await db.write();
    res.send(db.data.cities[cityIndex]);
  } else {
    res.status(500).send("Error: no city to update");
  }
});

app.post("/city/new", async (req, res) => {
  await db.read();
  const ids = db.data.cities.map((c) => {
    return c.id;
  });

  ids.sort((a, b) => b - a);
  const newId = ids[0] + 1;
  const newCity = { ...req.body, id: newId };

  console.log(ids);
  console.log(newId);
  console.log(newCity);
  db.data.cities.push(newCity);
  await db.write();
  res.end();
});

app.delete("/city/:id", async (req, res) => {
  await db.read();
  const deleteIndex = db.data.cities.findIndex(
    (city) => city.id === parseInt(req.params.id)
  );
  if (deleteIndex > -1) {
    db.data.cities.splice(deleteIndex, 1);
    await db.write();
    res.send(db.data.cities);
  } else {
    res.status(500).send(`Fehler! Keine Stadt mi id ${id} gefunden.`);
  }
});

app.get("/cars", async (req, res) => {
  await db.read();
  res.send(db.data.cars);
});

app.patch("/cars/:id", async (req, res) => {
  await db.read();
  const updateData = req.body;
  let carIndex = db.data.cars.findIndex(
    (car) => car.id === parseInt(req.params.id)
  );
  console.log(carIndex);
  if (carIndex > -1) {
    db.data.cars[carIndex] = { ...db.data.cars[carIndex], ...updateData };
    await db.write();
    res.send(db.data.cars[carIndex]);
  } else {
    res.status(500).send("Error: no city to update");
  }
});

app.post("/cars/new", async (req, res) => {
  await db.read();
  const ids = db.data.cars.map((c) => {
    return c.id;
  });

  ids.sort((a, b) => b - a);
  const newId = ids[0] + 1;
  const newCar = { ...req.body, id: newId };

  console.log(ids);
  console.log(newId);
  console.log(newCar);
  db.data.cars.push(newCar);
  await db.write();
  res.end();
});

app.delete("/cars/:id", async (req, res) => {
  await db.read();
  const deleteIndex = db.data.cars.findIndex(
    (car) => car.id === parseInt(req.params.id)
  );
  if (deleteIndex > -1) {
    db.data.cars.splice(deleteIndex, 1);
    await db.write();
    res.send(db.data.cars);
  } else {
    res.status(500).send(`Fehler! Keine Stadt mi id ${id} gefunden.`);
  }
});

app.listen(3000, function () {
  console.log("Listening on port: http://localhost:3000");
});
