const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().precision(2).min(0).required(),
  category: Joi.string().required(),
});
