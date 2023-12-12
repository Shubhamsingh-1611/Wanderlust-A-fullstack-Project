const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
   
    description:String ,
    image:{
        filename:String,
        url:String,
       
    },
    
      
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ] ,
    owner: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    geometry:{
        type:{
            type:String,
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,

        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing) {
        await Review.deleteMany({id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing