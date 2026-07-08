const { Joi } = require("celebrate");

module.exports = Joi.object({

    content: Joi.string()
        .trim(),

    tags: Joi.alternatives().try(

        Joi.string().trim(),

        Joi.array()
            .items(Joi.string().trim())
            .min(1)
            .max(10)

    )

});