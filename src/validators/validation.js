const Joi = require("joi");

exports.register = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional().allow("", null),
  }),
};

exports.login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

exports.createOrUpdate = {
  body: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().optional().allow(null, ""),
    area: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    pincode: Joi.string().optional().allow(null, ""),
    lat: Joi.number().precision(7).optional().allow(null),
    lng: Joi.number().precision(7).optional().allow(null),
    school_type: Joi.string().optional().allow(null, ""),
    age_group: Joi.string().optional().allow(null, ""),
    yearly_fee_min: Joi.number().integer().min(0).optional().allow(null),
    yearly_fee_max: Joi.number().integer().min(0).optional().allow(null),
    description: Joi.string().optional().allow("", null),
    facilities: Joi.array().items(Joi.string()).optional(),
    website: Joi.string().uri().optional().allow("", null),
    phone: Joi.string().optional().allow("", null),
  }),
};

exports.listSchools = {
  query: Joi.object({
    q: Joi.string().optional(),
    area: Joi.string().optional(),
    school_type: Joi.string().optional(),
    minFee: Joi.number().optional(),
    maxFee: Joi.number().optional(),
    minRating: Joi.number().optional().min(0).max(5),

    lat: Joi.number().required(), // required for location-based search
    lng: Joi.number().required(),
    radiusKm: Joi.number().min(1).max(50).default(5), // search radius

    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(5).max(50).default(10),

    name: Joi.string().optional(),
    city: Joi.string().optional(),

    sortBy: Joi.string()
      .valid("distance_km", "google_rating", "yearly_fee_min", "yearly_fee_max", "name")
      .default("distance_km"),
    sortOrder: Joi.string().valid("ASC", "DESC").default("ASC"),
  }),
};

exports.counsellingSchema = Joi.object({
  parent_name: Joi.string().min(3).max(100).required(),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  scheduled_date: Joi.date().min("now").required(),
  scheduled_time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  query: Joi.string().allow(""),
});
