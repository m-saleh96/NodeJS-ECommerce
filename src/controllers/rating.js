const  Rating  = require("../models/rating");

const { validationResult } = require('express-validator');

const rating = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
    
            return res.status(400).json({ errors: errorMessages });
        }

        const existRate = await Rating.findOne({productId:req.body.productId ,userId:req.userId });
        
        if(existRate){
            await Rating.findByIdAndUpdate(existRate._id , {rating : req.body.rating});
            return res.status(201).json({
                status: "update rating successfully",
            });
        }

        const rate = await Rating.create({
            ...req.body,
            userId: req.userId,
        });

        res.status(201).json({
            status: "success",
            data: {
            rating: rate,
        },
    });
    } catch (error) {
        next(error);
    }
};


const deleteRating = async (req, res, next) => {
    try {
        const exist = await Rating.findOne({_id : req.params.id , userId:req.userId});
        if (!exist) {
        return res.status(404).json({
            status: "fail",
            message: "Rating not Found",
        });
        }

        await Rating.deleteOne({_id : req.params.id , userId:req.userId});
        res.status(200).json({
            status: "success"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {deleteRating , rating}