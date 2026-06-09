const Joi = require("joi");

const providerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    price: Joi.number().required(),
    completedJobs: Joi.number().required(),
    experience: Joi.string(),
    // userId: Joi.string().required()
});
module.exports = providerSchema;