const express = require('express')
const router = express.Router({mergeParams:true})
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')


router.post('/',isLoggedIn,validateReview,CatchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,CatchAsync(reviews.deleteReview))


module.exports = router