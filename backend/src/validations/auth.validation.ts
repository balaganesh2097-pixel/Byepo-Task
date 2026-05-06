import Joi from "joi";

const superAdminLogin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const adminSignup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    organizationId: Joi.string().required().uuid(),
  }),
};

const userSignup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    organizationId: Joi.string().required().uuid(),
  }),
};

const genericLogin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export default {
  superAdminLogin,
  adminSignup,
  userSignup,
  genericLogin,
};
