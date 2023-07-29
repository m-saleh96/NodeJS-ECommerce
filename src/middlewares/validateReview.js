const { body } = require('express-validator');

const reviewCreateValidationRules = [
    body("review").notEmpty().isString().trim().withMessage("min length 10"),
];

module.exports = reviewCreateValidationRules;