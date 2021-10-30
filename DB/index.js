let mongoose = require("mongoose");

// importing mongoose so that we could have schema for the db, and below is the way to define schema (Word of String format, vocab_data Object); and exporting it

let VocabDBSchema = new mongoose.Schema({
  word: String,
  vocab_data: {},
});

module.exports = mongoose.model("Vocabulary", VocabDBSchema);
