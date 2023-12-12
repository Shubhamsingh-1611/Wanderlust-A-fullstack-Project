const Listing  = require("../models/listing.js");

module.exports.index= async (req,res,next)=>{
    const allListing= await Listing.find();
 res.render("index.ejs",{allListing});
 }