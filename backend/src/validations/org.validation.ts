import Joi from "joi";

const createOrganization = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
  }),
};

const updateOrganization = {
  params: Joi.object().keys({
    id: Joi.string().required().uuid(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
  }),
};

export default {
  createOrganization,
  updateOrganization,
};
