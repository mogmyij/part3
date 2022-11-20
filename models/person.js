const mongoose = require("mongoose");

const URI = process.env.MONGOURL;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected Succesfully");
  })
  .catch((err) => {
    console.log("Failed to connect error code", err);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("person", personSchema);
