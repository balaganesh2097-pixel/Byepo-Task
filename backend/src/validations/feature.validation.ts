import Joi from "joi";

const createFeatureFlag = {
  body: Joi.object().keys({
    key: Joi.string().required().min(1).trim().lowercase(),
    isEnabled: Joi.boolean().optional(),
  }),
};

const updateFeatureFlag = {
  params: Joi.object().keys({
    id: Joi.string().required().uuid(),
  }),
  body: Joi.object().keys({
    isEnabled: Joi.boolean().optional(),
    key: Joi.string().optional().min(1).trim().lowercase(),
  }).min(1),
};

const deleteFeatureFlag = {
  params: Joi.object().keys({
    id: Joi.string().required().uuid(),
  }),
};

const checkFeatureFlag = {
  params: Joi.object().keys({
    key: Joi.string().required().trim().lowercase()
  }),
};

export default {
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
  checkFeatureFlag,
};
