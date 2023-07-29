const { body } = require('express-validator');

const {User} = require('../models/user');

const validateExistUser =  async (value, { req }) => {

    const user =  await User.exists({ email: value });

    if (user) {
        throw new Error("user aready exist");
    }

    return true;
};

const userCreateValidationRules = [
    body("name").notEmpty().isString().trim().withMessage("name must be a string"),
    body("phone").isNumeric().trim().matches(/^01\d{9}$/).withMessage("invalid phone"),
    body("email").isEmail().trim().withMessage("Invalid email address").custom(validateExistUser),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
];

module.exports = { userCreateValidationRules }