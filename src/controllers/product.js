const { Product } = require('../models/product');

const { validationResult } = require('express-validator');

const fs = require('fs');

const path = require('path');

// to remove product image.
const deleteImage = (image) => {
    const imagePath = path.join(__dirname, '../assets/images', image);
    fs.rm(imagePath ,(err)=> err); 
}

const createProduct = async (req , res , next) => {
    try {
        const errors = validationResult(req);
        
        if (errors.errors.length !== 0) {
            const errorMessages = errors.array().map(error => error.msg);
            if (req.file) {
                deleteImage(req.file.filename);
            }
            return res.status(400).json({ errors: errorMessages });
        }

        const newProduct = await Product.create({
            ...req.body,
            image : req.file.filename
        })
        res.status(200).json(newProduct);

    } catch (error) {
        deleteImage(req.file.filename);
        next(error);
    }
}

const getAllProduct = async (req , res , next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: 'success',
            data :products
            });

    } catch (error) {
        next(error);
    }
}

const paginationProduct = async (req , res , next) => {
    try {
        const {page} = req.query;
        const productPerPage = 12;
        const totlaProduct = await Product.find().countDocuments();
        const products = await Product.find()
                                .skip((page-1) * productPerPage)
                                .limit(productPerPage)
        
        res.status(200).json({
            message: 'success',
            data :products,
            totlaProduct:totlaProduct,
            totalPages : Math.ceil(totlaProduct / productPerPage),
            curruntPage: Number(page),
            productPerPage:productPerPage
            });
        } catch (error) {
        next(error);
    }
}

const getProductById = async (req , res , next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "product not found",
            });
        }

        res.status(200).json({
            message: 'success',
            data :product
            });

    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req , res , next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "product not found",
            });
        } else {
            deleteImage(product.image);
            res.status(200).json({
                message: 'deleted success'
            });
        }

    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req , res , next) => {
    try {
        const errors = validationResult(req);

        if (errors.errors.length !== 0) {
            const errorMessages = errors.array().map(error => error.msg);
            if (req.file) {
                deleteImage(req.file.filename);
            }
            return res.status(400).json({ errors: errorMessages });
        }
        
        if (req.file) {
            const image = req.file;
            if (!image.mimetype.startsWith("image")) {
                deleteImage(req.file.filename);
                throw new Error("Invalid file type. Only image files are allowed.");
            }
        
            const maxImageSize = 500 * 1024;
            if (req.file.size > maxImageSize) {
                deleteImage(req.file.filename);
                throw new Error(`max image size is 500KB `);
            }
        }

        let newImage;
        if (req.file) {
            newImage = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(req.params.id , {...req.body , image:newImage});
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "product not found",
            });
        } else {
            if (req.file) {
                deleteImage(product.image);
            }
            res.status(200).json({
                message: 'updated success'
            });
        }

    } catch (error) {
        next(error);
    }
}


module.exports = { 
    getAllProduct, 
    createProduct, 
    getProductById, 
    deleteProduct,
    updateProduct,
    paginationProduct
};