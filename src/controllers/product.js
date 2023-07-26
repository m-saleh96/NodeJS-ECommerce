const { Product } = require('../models/product');

const fs = require('fs');

const path = require('path');

const createProduct = async (req , res , next) => {
    try {
        const newProduct = await Product.create({
            ...req.body,
            image : req.file.filename
        })
        res.status(200).json(newProduct);
    } catch (error) {
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
            const imagePath = path.join(__dirname, '../assets/images', product.image);

            fs.rm(imagePath ,(err)=>{
                if (!err) {
                    res.status(200).json({
                        message: 'deleted success'
                    });
                }
            })
        }

    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req , res , next) => {
    try {
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
                const imagePath = path.join(__dirname, '../assets/images', product.image);
                fs.rm(imagePath ,(err)=> err );
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
    updateProduct
};