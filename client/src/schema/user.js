import Joi from '@hapi/joi';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
});

export default schema;
