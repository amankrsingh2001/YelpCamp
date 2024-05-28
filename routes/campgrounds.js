const express = require('express')
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')
const {isLoggedIn} = require('../middleware.js')


const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

router.get('/',async (req,res)=>{
    const campgrounds = await Campground.find({}); 
    res.render('campgrounds/index',{campgrounds})
})


router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground,CatchAsync( async (req,res,next)=>{
   
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
    const campground = new Campground(req.body.campground)
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id',CatchAsync( async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error','Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit',isLoggedIn, CatchAsync(async (req,res)=>{
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/edit',{campground})
}))

router.put('/:id',isLoggedIn,validateCampground,CatchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})    
    req.flash('success','Successfully updated the Campground')  
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn,CatchAsync(async (req,res)=>{
    const {id} = req.params
     await Campground.findByIdAndDelete(id)
     req.flash('success','Successfully deleted Campground')
     res.redirect('/campgrounds')
}))



module.exports = router;