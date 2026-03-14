const Joi = require("joi");

const registerSchema = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    role: Joi.string().valid("admin","user").default("user")
});
module.exports = registerSchema