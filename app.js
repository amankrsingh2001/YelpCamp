const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const Campground = require('./models/campground')
const CatchAsync = require('./utils/CatchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Review = require('./models/review')

const campgrounds = require('./routes/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

//database connetion 
const db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('Database Connected')
})

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));


app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))



const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
    
}

app.use('/campgrounds',campgrounds)

app.get('/',(req,res)=>{
    res.render('home')
})


app.post('/campgrounds/:id/reviews',validateReview,CatchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId',CatchAsync(async(req,res)=>{
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    res.redirect(`/campgrounds/${id}`)
}))



app.all("*",(req,res,next)=>{  //for every path we are going to call this call back
    next(new ExpressError('Page Not Found',404))
}) // The order is very important and this will only run if nothing else is matched


app.use((err,req,res,next)=>{
    const {statusCode = 500}  = err
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error',{err})

})



app.listen(3000,()=>{
    console.log('App is listining on Port 3000');
})

