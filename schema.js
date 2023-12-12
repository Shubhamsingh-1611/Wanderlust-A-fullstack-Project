const Joi = require("joi");
const { model } = require("mongoose");
  
const listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.object({
            filename:Joi.string().required(),
            url:Joi.string().required(),
        }),
        geometry:Joi.object({
            type:Joi.string().required(),
            coordinates:Joi.number().required(),
        }),
    }).required()
});
module.exports = {listingSchema};
// class export karte hai tabhi equal to karke bhejte hai agar koi variable bhejte hai to is tarah se bhejte the hai
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})