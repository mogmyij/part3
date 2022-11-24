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
  Person.countDocuments({}, (err, size) => {
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
  //check if person already exsits
  Person.find({ name: newPerson.name }).then((person) => {
    if (person.length > 0) {
      return response.status(409).json({ error: "contact already exists" });
    }

    //add person if not a duplicate
    const newDocument = new Person({
      name: newPerson.name,
      number: newPerson.number,
    });
    newDocument.save().then((newDocument) => {
      response.json(newDocument);
    });
  });
});

app.put("/api/persons/:id", (request, response) => {
  const personId = request.params.id;
  console.log("personID", personId);
  //check if valid ID
  if (!mongoose.isValidObjectId(personId)) {
    console.log("invalid id: ", personId);
    return response.status(400).json({ error: "invalid ID" });
  }

  //check if person object had valid values
  const updatedPerson = request.body;
  if (updatedPerson.name === "" || updatedPerson.number === null) {
    return response.status(409).json({ error: "invalid contact" });
  }

  console.log("new person", updatedPerson);

  Person.findOneAndUpdate({ _id: personId }, updatedPerson, { new: true })
    .then((person) => {
      console.log("updated person:", person);
      response.json(person);
    })
    .catch((err) => {
      console.log("failed to update contact: ", err);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  //make sure ID is a valid object ID
  const personId = request.params.id;
  if (!mongoose.isValidObjectId(personId)) {
    console.log(personId, "is an invalid person ID");
    return response.status(400).json({ error: "invalid objectID" });
  }

  Person.deleteOne({ _id: personId })
    .then((result) => {
      response.sendStatus(200);
    })
    .catch((err) => {
      console.log(`unable to delete person with ID of ${personId}`,err);
      response.status(404).json({ error: "unable to delete contact" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
