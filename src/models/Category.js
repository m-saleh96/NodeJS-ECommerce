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

categorySchema.pre('findOneAndDelete', async function (next) {
  const Product = mongoose.model('product');
  await Product.deleteMany({ categoryId: this._conditions._id });
  next();
});

const Category = mongoose.model("category", categorySchema);

module.exports = { Category };
