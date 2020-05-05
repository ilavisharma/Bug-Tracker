import Joi from '@hapi/joi';

const schema = Joi.object({
  name: Joi.string().required()
});

export default schema;
