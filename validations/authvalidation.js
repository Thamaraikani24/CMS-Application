const { celebrate, Joi, Segments } = require("celebrate");

const loginValidation = celebrate({
    [Segments.BODY]: Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Please enter a valid email address",
                "any.required": "Email is required"
            }),

        password: Joi.string()
            .required()
            .messages({
                "string.empty": "Password is required",
                "any.required": "Password is required"
            })
    })
});

module.exports = {
    loginValidation
};