const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

let people = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const randomID = Math.floor(Math.random() * 10000) + people.length;
  return String(randomID);
};

app.get("/", (req, res) => {
  res.send("<h1>Welcom to Phonebook</h1>");
});

app.get("/info", (req, res) => {
  const entries = people.length;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Bucharest",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "long",
  });
  const htmlString = `<p>Phonebook has info for ${entries} people <br> ${timestamp} </p>`;
  res.send(htmlString);
});

app.get("/api/persons", (req, res) => {
  res.json(people);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(404).json({
      error: "Name and number is required",
    });
  }

  const existing = people.find((p) => p.name === req.body.name);
  if (existing) {
    return res.status(400).json({
      error: "Person already exists in the phonebook",
    });
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generateId(),
  };

  people = people.concat(person);
  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = people.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  people = people.filter((person) => person.id !== id);
  res.status(204).end();
});

app.listen(3001, () => {
  console.log("App running at 3001");
});
