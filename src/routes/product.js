const { Router } = require("express");

const product = Router();

const multer = require("multer");

const { multerImageFilter, multerStoreProductImage } = require("../middlewares/multer");

const upload = multer({
    storage: multerStoreProductImage,
    fileFilter: multerImageFilter,
});

const { 
    getAllProduct,
    createProduct, 
    getProductById,
    deleteProduct,
    updateProduct
} = require("../controllers/product");

product.route("/product")
    .get(getAllProduct)
    .post(
        upload.single('image'), //multer middleware upload image
        createProduct
    );


product.route("/product/:id")
    .get(getProductById)
    .delete(deleteProduct)
    .put(
        upload.single('image'), //multer middleware upload image,
        updateProduct
    );

module.exports = product;
