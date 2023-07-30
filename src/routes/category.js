const { Router } = require("express");

const {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
} = require("../controllers/category");

const categoryValidationRules = require("../middlewares/validateCategory");


const { authenticate, checkRole } = require("../middlewares/auth");

category = new Router();

category
  .route("/category")
  .get(getAllCategories)
  .post(
    authenticate,
    checkRole("admin"), 
    categoryValidationRules,
    createCategory
  );

category
  .route("/category/:id")
  .get(getCategoryById) 
  .put(
    authenticate,
    checkRole("admin"), 
    categoryValidationRules,
    updateCategory
  )
  .delete(
    authenticate,
    checkRole("admin"),
    deleteCategory
  ); 

module.exports = category;
