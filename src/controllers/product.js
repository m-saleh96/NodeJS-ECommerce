const { Product } = require('../models/product');

const { validationResult } = require('express-validator');

const {validateImage} = require("../middlewares/validationProduct");

const fs = require('fs');

const path = require('path');

// to remove product image.
const deleteImage = (image) => {
    const imagePath = path.join(__dirname, '../assets/images', image);
    fs.rm(imagePath ,(err)=> err); 
}

const createProduct = async (req , res , next) => {
    const images = [];
    req.files.forEach(elm => {
        images.push(elm.filename);
    });
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            if (req.files) {
                images.forEach(elm=>{
                    deleteImage(elm);
                })
            }
            return res.status(400).json({ errors: errorMessages });
        }

        const newProduct = await Product.create({
            ...req.body,
            categoryId:req.body.category,
            images : images
        })
        res.status(200).json(newProduct);

    } catch (error) {
        images.forEach(elm=>{
            deleteImage(elm);
        })
        next(error);
    }
}

const getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.find().populate('reviews');

        res.status(200).json({
            message: 'success',
            data: products,
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
                                .limit(productPerPage).populate('reviews');
        
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
        console.log(product);
        if (!product) {
            return res.status(400).json({
                status: "fail",
                message: "product not found",
            });
        } else {
            product.images.forEach(elm=>{
                deleteImage(elm);
            })
            
            res.status(200).json({
                message: 'deleted success'
            });
        }

    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req , res , next) => {
    const images = [];
    req.files.forEach(elm => {
        images.push(elm.filename);
    });
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            if (req.files) {
                images.forEach(elm=>{
                    deleteImage(elm.filename);
                })        
            }
            return res.status(400).json({ errors: errorMessages });
        }
        
        if (req.files) {
            for (const elm of req.files) {
                if (!elm.mimetype.startsWith("image")) {
                    images.forEach(elm => {
                        deleteImage(elm);
                    });
                    return res.status(400).json({
                        message: "Invalid file type. Only image files are allowed.",
                    });
                }
        
                const maxImageSize = 500 * 1024;
                if (elm.size > maxImageSize) {
                    images.forEach(elm => {
                        deleteImage(elm);
                    });
                    return res.status(400).json({
                        message: "Max image size is 500KB",
                    });
                }
            }
        }
        

        const product = await Product.findByIdAndUpdate(req.params.id , {...req.body , images:images});
        if (!product) {
            images.forEach(elm=>{
                deleteImage(elm);
            })
            return res.status(400).json({
                status: "fail",
                message: "product not found",
            });
        } else {
            if (req.files) {
                console.log(product.images);
                product.images.forEach(elm=>{
                    deleteImage(elm);
                })
                res.status(200).json({
                    message: 'updated success'
                });
            }
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