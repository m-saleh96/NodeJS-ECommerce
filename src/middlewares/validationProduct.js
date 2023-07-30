const { body } = require('express-validator');

const {Category} = require('../models/Category');

const validateImage = (value, { req }) => {
    if (!req.files) {
        throw new Error("image is required");
    }

    req.files.forEach(elm=>{
        if (!elm.mimetype.startsWith("image")) {
            throw new Error("Invalid file type. Only image files are allowed.");
        }
    })


    const maxImageSize = 500 * 1024;
    req.files.forEach(elm=>{
        if (elm.size > maxImageSize) {
            throw new Error(`max image size is 500KB `);
        }
    })
    return true;
};

const validateExistCategory =  async (value, { req }) => {

    const category =  await Category.exists({ _id: value });

    if (!category) {
        throw new Error("category not exist");
    }

    return true;
};

const addProductValidation = [
    body('name').notEmpty().isString().trim().withMessage('name must be string'),
    body('price').isNumeric().trim().withMessage('price must be number'),
    body('description').isString().trim().withMessage('description must be string'),
    body('images').custom(validateImage),
    body('category').custom(validateExistCategory)
];

const updateProductValidation = [
    body('name').notEmpty().optional().isString().trim().withMessage('name must be string'),
    body('price').optional().isNumeric().trim().withMessage('price must be number'),
    body('description').optional().isString().trim().withMessage('description must be string'),
    body('images').optional().custom(validateImage),
    body('category').optional().custom(validateExistCategory)
];

module.exports = { addProductValidation , updateProductValidation , validateImage}