const Review = require("./models/review");
const isAuthor = async (req,res,next)=>{
    let{id,reviewId}=req.params;
   
    let review = await Review.findById(reviewId);
    // console.log(res.locals.currUser);
    // console.log(review);
    if(!review.author.equals(res.locals.currUser.id)) {
       req.flash("error","You not have permission to delete the review");
       return res.redirect(`/listings/${id}`)
    }
    next();
};
module.exports = isAuthor;