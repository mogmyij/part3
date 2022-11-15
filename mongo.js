const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const password = process.env.PASSWORD;
const url = process.env.MONGOURL;
//check for correct number of arguments
if (process.argv.length < 3 || process.argv.length == 4) {
  console.log(
    "incorrect syntax, correct syntax is: mongoose.js [password] [Name] [Number]"
  );
  process.exit();
}
//check if correct password
if (process.argv[2] !== password) {
  console.log("incorrect password");
  process.exit();
}
//creating schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("person", personSchema);

if (process.argv.length > 3) {
  const personName = process.argv[3];
  const personNumber = process.argv[4];
  const person = new Person({
    name: personName,
    number: personNumber,
  });
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");
      return person.save();
    })
    .then(() => {
      console.log("note Saved");
      mongoose.connection.close();
      process.exit();
    })
    .catch((err) => console.log(err));
}

mongoose.connect(url).then((result) => {
  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
});
