const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const Person = require("./models/person");
const { isValidObjectId, default: mongoose } = require("mongoose");
const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan("tiny", {
    skip: (req, res) => {
      return req.method === "POST";
    },
  })
);

morgan.token("POST-LOG", (req, res) => {
  requestBodyString = JSON.stringify(req.body);
  return requestBodyString;
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :POST-LOG ",
    {
      skip: (req, res) => {
        return req.method !== "POST";
      },
    }
  )
);

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
  {
    id: 5,
    name: "backend",
    number: "1231245",
  },
];

app.get("/api/persons", (request, response) => {
  //this returns a list of all entries of the database
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => {
      console.log("failed to get persons error:", err);
    });
});

app.get("/api/persons/:id", (request, response) => {
  //checks if the ID is a valid objectID
  const personId = request.params.id;
  //sends error code 400 if invalid
  if (!mongoose.isValidObjectId(personId)) {
    console.log(personId, "is an invalid ID");
    return response.status(400).json({ error: "invalid objectID" });
  }
  //finds person by ID provided
  Person.findById(personId, (err, person) => {
    if (err != undefined || person === null) {
      console.log("failed to find person by ID error:", err);
      return response.status(404).json({ error: "id not found" });
    }
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  Person.countDocuments({}, (err,size) => {
    response.write(`<p>There are ${size} contacts saved<p>`);
    var dateTime = new Date();
    response.write(`${dateTime.toString()}`);
    response.send();
  });
});

app.post("/api/persons", (request, response) => {
  //create new person object based on request
  var newPerson = request.body;
  //if the name or number of the new object is empty throw an error
  if (newPerson.name === undefined || newPerson.number === undefined) {
    return response.status(422).json({
      error: "invalid contact information",
    });
  }
  var duplicateName = phoneBook.find((person) => person.name == newPerson.name);
  if (duplicateName !== undefined) {
    return response.status(409).json({
      error: "contact already exists",
    });
  }

  newPerson = { id: Math.floor(Math.random() * 10000), ...newPerson };
  phoneBook.push(newPerson);
  response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const personId= request.params.id
  if (!mongoose.isValidObjectId(personId)) {
    console.log(personId, "is an invalid person ID");
    return response.status(400).json({error: "invalid objectID"})
  }
  //const personId = parseInt(request.params.id);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
