const Joi = require("joi");

const validateArticle = (data, isUpdate = false) => {

    const schema = Joi.object({

        content: isUpdate
            ? Joi.string().trim()
            : Joi.string()
                .trim()
                .required()
                .messages({
                    "string.empty": "Content is required",
                    "any.required": "Content is required"
                }),

        tags: isUpdate
            ? Joi.alternatives().try(
                Joi.string().trim(),
                Joi.array()
                    .items(Joi.string().trim())
                    .min(1)
                    .max(10)
            )
            : Joi.alternatives().try(
                Joi.string().trim(),
                Joi.array()
                    .items(Joi.string().trim())
                    .min(1)
                    .max(10)
            ).required().messages({
                "any.required": "Tags are required"
            })

    });

    return schema.validate(data);

};

module.exports = validateArticle;