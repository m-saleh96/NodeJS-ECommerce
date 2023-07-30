const mongoose = require("mongoose");

const { body } = require("express-validator");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    trim: true,
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = { Category };
