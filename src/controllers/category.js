const { Category } = require('../models/Category');

const {Product} = require('../models/product');

const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find({});

    res.status(200).json({
      message: "success",
      result: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not Found",
      });
    }

    const products = await Product.find({categoryId : category._id}).populate('reviews');

    res.status(200).json({
      message: "success",
      data: {
        category,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create({
      ...req.body,
    });
    res.status(201).json({
      message: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({
        message: "fail",
        message: "Category not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Category not Found",
      });
    }
    res.status(200).json({
      status: "deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
};
