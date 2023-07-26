const { Router } = require("express");

const product = Router();

const { 
    getAllProduct,
    createProduct, 
    getProductById,
    deleteProduct,
    updateProduct
} = require("../controllers/product");

product.route("/product")
    .get(getAllProduct)
    .post(createProduct)


product.route("/product/:id")
    .get(getProductById)
    .delete(deleteProduct)
    .put(updateProduct)

module.exports = product;
