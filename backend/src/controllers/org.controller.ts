import catchAsync from "../middlewares/catch.async";
import apiResponse from "../config/api.response";
import { orgService } from "../services";

const createOrganization = catchAsync(async (req, res) => {
  const { name } = req.body;
  
  if (!name) return apiResponse.badRequest(res, "Name is required");

  const existing = await orgService.findOrganizationByName(name);
  if (existing) {
    return apiResponse.badRequest(res, "Organization with this name already exists");
  }

  const org = await orgService.createOrganization(name);

  return apiResponse.successResponse(res, "Organization created", org);
});

const listOrganizations = catchAsync(async (req, res) => {
  const orgs = await orgService.listOrganizations();
  return apiResponse.successResponse(res, "Organizations retrieved", orgs);
});

const updateOrganization = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const { name } = req.body;
  
  const org = await orgService.getOrganizationById(id);
  if (!org) {
    return apiResponse.notFound(res, "Organization not found");
  }

  const existing = await orgService.findOrganizationByName(name, id);
  if (existing) {
    return apiResponse.badRequest(res, "Organization with this name already exists");
  }

  const updatedOrg = await orgService.updateOrganization(id, name);
  return apiResponse.successResponse(res, "Organization updated", updatedOrg);
});

export default {
  createOrganization,
  listOrganizations,
  updateOrganization,
};
