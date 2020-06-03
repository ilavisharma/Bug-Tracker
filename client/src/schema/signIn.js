import Joi from '@hapi/joi';

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .required()
    .min(4)
});

export default schema;
