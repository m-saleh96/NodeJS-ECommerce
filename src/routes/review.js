const {Router} = require('express');

const review = Router();

const {
    authenticate
} = require('../middlewares/auth');

const {
    createReview,
    deleteReview
} = require('../controllers/review');

const reviewCreateValidationRules = require('../middlewares/validateReview');

review.route('/review')
    .post(
        authenticate,
        reviewCreateValidationRules,
        createReview
    )

    
review.route('/delreview/:id')
    .delete(
        authenticate,
        deleteReview
    );

module.exports = review;