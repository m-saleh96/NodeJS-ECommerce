const { body } = require('express-validator');

const categoryValidationRules = [
    body("name").notEmpty().isString().withMessage("Category name must be string"),
];

module.exports = categoryValidationRules;