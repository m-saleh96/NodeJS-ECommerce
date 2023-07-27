const mongoose = require('mongoose');

const { body , check } = require('express-validator');

const productSchema = new mongoose.Schema({
    name:{ type:String , required:true} , 
    price :{type:Number,required: true},
    description : {type: String },
    image : { type:String , required:true},
},{ timestamps: true });

const Product = mongoose.model('product' , productSchema);

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
    body('name').isString().withMessage('name must be string'),
    body('price').isNumeric().withMessage('price must be number'),
    body('description').isString().withMessage('description must be string'),
    body('image').custom(validateImage)
];

const updateProductValidation = [
    body('name').optional().isString().withMessage('name must be string'),
    body('price').optional().isNumeric().withMessage('price must be number'),
    body('description').optional().isString().withMessage('description must be string'),
    body('image').optional().custom(validateImage)
];

module.exports = { Product , addProductValidation , updateProductValidation }