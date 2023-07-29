const { body } = require('express-validator');

const ratingCreateValidationRules = [
    body("rating")
        .isFloat({ min: 0, max: 5 })
        .withMessage("rating must be number between 0 and 5"),
];

module.exports = ratingCreateValidationRules