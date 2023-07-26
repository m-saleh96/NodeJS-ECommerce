const { Product } = require('../models/product');

const createProduct = async (req , res , next) => {
    try {
        const newProduct = await Product.create({...req.body})
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
        }

        res.status(200).json({
            message: 'success',
            data : null
            });

    } catch (error) {
        next(error);
    }
}

const updateProduct = async (req , res , next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id , {...req.body});
        if (!product) {
            return res.status(404).json({
                status: "fail",
                message: "product not found",
            });
        }

        res.status(200).json({
            message: 'success'
            });

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