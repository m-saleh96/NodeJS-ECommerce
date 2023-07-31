const multer = require('multer');

const multerStoreProductImage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null , 'src/assets/images');  // callback function that select folder to save images
    },
    filename:(req, file, cb)=>{  // callback function that generates a unique name for each
        cb(null , Date.now()+"."+file.originalname.split(".")[1]);
    }
});

const multerImageFilter = (_req, file, cb) => {
    const allowedFormats = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
};

module.exports = {multerStoreProductImage , multerImageFilter};