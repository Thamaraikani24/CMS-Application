const { Joi } = require("celebrate");

module.exports = Joi.object({

    content: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Content is required",
            "any.required": "Content is required"
        }),

    tags: Joi.alternatives().try(

        Joi.string().trim(),

        Joi.array()
            .items(Joi.string().trim())
            .min(1)
            .max(10)

    ).required().messages({
        "any.required": "Tags are required"
    })

});