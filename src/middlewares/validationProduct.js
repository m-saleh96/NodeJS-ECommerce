const { body } = require('express-validator');

const validateImage = (value, { req }) => {
    if (!req.file) {
        throw new Error("image is required");
    }

    const image = req.file;
    if (!image.mimetype.startsWith("image")) {
        throw new Error("Invalid file type. Only image files are allowed.");
    }

    const maxImageSize = 500 * 1024;
    if (req.file.size > maxImageSize) {
        throw new Error(`max image size is 500KB `);
    }

    return true;
};

const addProductValidation = [
    body('name').notEmpty().isString().trim().withMessage('name must be string'),
    body('price').isNumeric().trim().withMessage('price must be number'),
    body('description').isString().trim().withMessage('description must be string'),
    body('image').custom(validateImage)
];

const updateProductValidation = [
    body('name').notEmpty().optional().isString().trim().withMessage('name must be string'),
    body('price').optional().isNumeric().trim().withMessage('price must be number'),
    body('description').optional().isString().trim().withMessage('description must be string'),
    body('image').optional().custom(validateImage)
];

module.exports = { addProductValidation , updateProductValidation }