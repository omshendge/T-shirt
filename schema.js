const Joi= require("joi");
module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        gender:Joi.string().required(),
        category:Joi.string().required(),
        size: Joi.array().items(Joi.string()).min(1) ,

    }).required()

});
module.exports.reviewSchema=Joi.object({
    review:Joi.object(
        {
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required(),
        }
    ).required()
});