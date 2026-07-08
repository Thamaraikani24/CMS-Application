const { Joi } = require("celebrate");

module.exports = Joi.object({

    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.length": "Invalid Article ID",
            "string.hex": "Invalid Article ID",
            "any.required": "Article ID is required"
        })

});