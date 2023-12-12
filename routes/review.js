const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema}  = require("../schema.js");
const isLoggedIn = require("../middleware.js");
const isAuthor = require("../middleware4.js");


//   review validation function using joi
const validateReviews= (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error) {
       throw new ExpressError("400",result.error.message);
    } else {
        next();
    }
};
//   post route review
router.post("/",isLoggedIn,validateReviews, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user.id;
    console.log(newReview);
    listing.reviews.push(newReview);
    (await newReview.save()).populate("author");
    await listing.save();
    console.log("new Review Saved");
    res.redirect(`/listings/${id}`)
}));
// delete route review

router.delete("/:reviewId",isAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   res.redirect(`/listings/${id}`);
}));
module.exports=router;