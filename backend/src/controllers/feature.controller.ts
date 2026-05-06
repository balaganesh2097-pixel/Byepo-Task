import catchAsync from "../middlewares/catch.async";
import apiResponse from "../config/api.response";
import { featureService } from "../services";

const createFeatureFlag = catchAsync(async (req, res) => {
  const { key, isEnabled } = req.body;
  const user = res.locals.user;

  if (!key) return apiResponse.badRequest(res, "Key is required");

  const existing = await featureService.getFeatureFlagByKey(key, user.organizationId);
  if (existing) {
    return apiResponse.badRequest(res, "Feature flag with this key already exists in your organization");
  }

  const feature = await featureService.createFeatureFlag({
    key,
    isEnabled: isEnabled || false,
    organizationId: user.organizationId,
  });
  return apiResponse.successResponse(res, "Feature flag created", feature);
});

const listFeatureFlags = catchAsync(async (req, res) => {
  const user = res.locals.user;
  const flags = await featureService.listFeatureFlags(user.organizationId);
  return apiResponse.successResponse(res, "Feature flags retrieved", flags);
});

const updateFeatureFlag = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const { isEnabled, key } = req.body;
  const user = res.locals.user;

  const feature = await featureService.getFeatureFlagById(id);

  if (!feature) {
    return apiResponse.notFound(res, "Feature flag not found");
  }

  if (feature.organizationId !== user.organizationId) {
    return apiResponse.unauthorized(res, "Access denied to this feature flag");
  }

  if (key && key !== feature.key) {
    const existing = await featureService.getFeatureFlagByKey(key, user.organizationId);
    if (existing) {
      return apiResponse.badRequest(res, "Feature flag with this key already exists in your organization");
    }
  }

  const updatedFeature = await featureService.updateFeatureFlag(id, {
    ...(isEnabled !== undefined && { isEnabled }),
    ...(key && { key })
  });
  return apiResponse.successResponse(res, "Feature flag updated", updatedFeature);
});

const deleteFeatureFlag = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const user = res.locals.user;

  const feature = await featureService.getFeatureFlagById(id);

  if (!feature) {
    return apiResponse.notFound(res, "Feature flag not found");
  }

  if (feature.organizationId !== user.organizationId) {
    return apiResponse.unauthorized(res, "Access denied to this feature flag");
  }

  await featureService.deleteFeatureFlag(id);
  return apiResponse.successResponse(res, "Feature flag deleted");
});

const checkFeatureFlag = catchAsync(async (req, res) => {
  const key = req.params.key as string;
  const user = res.locals.user;

  const feature = await featureService.getFeatureFlagByKey(key, user.organizationId);

  if (!feature) {
    return apiResponse.notFound(res, "Feature flag not found in your organization");
  }

  const message = feature.isEnabled ? "Feature is enabled" : "Feature is disabled";
  return apiResponse.successResponse(res, message, {
    key,
    isEnabled: feature.isEnabled,
  });
});

export default {
  createFeatureFlag,
  listFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
  checkFeatureFlag,
};
