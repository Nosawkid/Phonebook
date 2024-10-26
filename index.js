require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const app = express();

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

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
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(404).json({
      error: "Name and number is required",
    });
  }

  // const existing = people.find((p) => p.name === req.body.name);
  // if (existing) {
  //   return res.status(400).json({
  //     error: "Person already exists in the phonebook",
  //   });
  // }

  const newContact = new Contact({
    name: req.body.name,
    number: req.body.number,
  });

  newContact.save().then((savedContact) => {
    res.json(savedContact);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  Contact.findById(id).then((contact) => {
    res.json(contact);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  people = people.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("App running at 3001");
});
