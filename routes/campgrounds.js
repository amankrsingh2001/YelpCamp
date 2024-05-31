const express = require('express')
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const CatchAsync = require('../utils/CatchAsync')
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js')
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

router.route('/')
    .get(CatchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,CatchAsync(campgrounds.createCampground))
    

router.get('/new',isLoggedIn,campgrounds.renderNewForm)
    
router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,CatchAsync(campgrounds.deleteCampground))




router.get('/:id/edit',isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))

module.exports = router;