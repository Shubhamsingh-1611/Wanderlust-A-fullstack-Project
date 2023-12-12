const Listing = require("./models/listing.js");
const isOwner = async (req,res,next)=>{
    let{id}=req.params;
    
    // let newlisting = req.body.listing;
    let listing = await Listing.findById(id);
    console.log(listing.owner);
    console.log(res.locals.currUser.id)

    if(!listing.owner.equals(res.locals.currUser.id)) {
       req.flash("error","You not have permission to delete the listing");
       return res.redirect(`/listings/${id}`)
    }
    next();
};
module.exports = isOwner;

// revice the equal to wala logic