const Joi = require('joi');

module.exports = (schema) => (req, res, next) => {
  const toValidate = {};
  if (schema.params) toValidate.params = req.params;
  if (schema.query) toValidate.query = req.query;
  if (schema.body) toValidate.body = req.body;

  const { error } = Joi.compile(schema).validate(toValidate, { abortEarly: false, allowUnknown: false });
  if (error) {
    const details = error.details.map(d => ({ path: d.path.join('.'), message: d.message }));
    return res.status(400).json({ message: 'Validation failed', details });
  }
  return next();
};
