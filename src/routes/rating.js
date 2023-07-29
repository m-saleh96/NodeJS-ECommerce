const {Router} = require('express')

const rate = Router();

const ratingCreateValidationRules = require('../middlewares/validateRating');

const {
    rating,
    deleteRating
} = require('../controllers/rating');

const {
    authenticate
} = require('../middlewares/auth');

rate.route('/rating')
    .post(
        authenticate,
        ratingCreateValidationRules,
        rating
    );

rate.route('/delrating/:id')
    .delete(
        authenticate,
        deleteRating
    );

module.exports = rate;
