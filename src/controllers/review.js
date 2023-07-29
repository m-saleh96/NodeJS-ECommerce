const Review = require('../models/review');

const { validationResult } = require('express-validator');

const createReview = async (req , res , next) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
    
            return res.status(400).json({ errors: errorMessages });
        }
        
        const existReview = await Review.findOne({productId:req.body.productId ,userId:req.userId });

        if(existReview){
            await Review.findByIdAndUpdate(existReview._id , {review : req.body.review});
            return res.status(201).json({
                status: "update review successfully",
            });
        } 

        const review = await Review.create({
            ...req.body , 
            userId : req.userId,
            userName:req.userName
        });

        res.status(201).json({
            status: "success",
            data: {
            review: review,
            }
        });
        
    } catch (error) {
        next(error);
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const exist = await Review.findOne({_id : req.params.id , userId:req.userId});
        if (!exist) {
        return res.status(404).json({
            status: "fail",
            message: "review not Found",
        });
        }

        await Review.deleteOne({_id : req.params.id , userId:req.userId});
        res.status(200).json({
            status: "success"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {createReview , deleteReview}