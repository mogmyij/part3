const { response } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/persons/:id", (request, response) => {
  const personId = parseInt(request.params.id);
  var person = phoneBook.find((person) => person.id === personId);
  if (person === undefined) {
    return response.status(404).json({
      error: "contact not found",
    });
  }
  response.json(person);
});

app.get("/info", (request, response) => {
  var size = phoneBook.length;
  var dateTime = new Date();

  response.write(`<p>There are ${size} contacts saved<p>`);
  response.write(`${dateTime.toString()}`);
  response.send();
});

app.post("/api/persons", (request, response) => {
  var newPerson = request.body;
  if (newPerson.name === undefined || newPerson.number === undefined) {
    return response.status(422).json({
      error: "invalid contact information",
    });
  }
  var duplicateName = phoneBook.find((person) => person.name == newPerson.name);
  if (duplicateName !== undefined ) {
    return response.status(409).json({
      error: "contact already exists",
    });
  }

  newPerson = { id: Math.floor(Math.random() * 10000), ...newPerson };
  phoneBook.push(newPerson);
  response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const personId = parseInt(request.params.id);
  var indexOfPersonToDelete = phoneBook.findIndex(
    (person) => person.id === personId
  );
  if (indexOfPersonToDelete === -1) {
    return response.status(404).json({
      error: "contact not found",
    });
  }
  phoneBook.splice(indexOfPersonToDelete, 1);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
