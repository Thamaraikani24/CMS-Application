const { Joi } = require("celebrate");

module.exports = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .default(6),

    sort: Joi.string()
        .valid("newest", "oldest")
        .default("newest"),

    search: Joi.string()
        .allow("")
        .optional(),

    tag: Joi.string()
        .allow("")
        .optional()

});