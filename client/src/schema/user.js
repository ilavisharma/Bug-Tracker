import Joi from '@hapi/joi';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
});

export default schema;
