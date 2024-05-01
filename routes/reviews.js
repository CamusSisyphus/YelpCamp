const express = require('express');
const router = express.Router({mergeParams : true});
const reviews = require('../controllers/reviews.js')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isReviewAuthor, validateReview}= require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require("../models/review");



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))


module.exports = router;