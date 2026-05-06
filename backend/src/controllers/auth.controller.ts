import catchAsync from "../middlewares/catch.async";
import apiResponse from "../config/api.response";
import passwordConfig from "../config/password.config";
import tokenConfig from "../config/token.config";
import { userService, orgService } from "../services";
import { Role } from "../generated/prisma/client";

const superAdminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = tokenConfig.generateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN); 
    return apiResponse.successResponse(res, "Super Admin logged in", {
      role: Role.SUPER_ADMIN,
      ...token,
    });
  }
  return apiResponse.unauthorized(res, "Invalid super admin credentials");
});

const adminSignup = catchAsync(async (req, res) => {
  const { name, email, password, organizationId } = req.body;
  
  const existingOrg = await orgService.getOrganizationById(organizationId);
  if (!existingOrg) {
    return apiResponse.badRequest(res, "Organization not found");
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return apiResponse.badRequest(res, "Email already in use");
  }

  const hashedPassword = await passwordConfig.passwordHash(password);
  if (!hashedPassword) return apiResponse.badRequest(res, "Password hashing failed");

  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
    organizationId,
  }, Role.ADMIN);

  const token = tokenConfig.generateToken(user.id, "USER");
  return apiResponse.successResponse(res, "Org Admin registered", { ...user, ...token });
});

const userSignup = catchAsync(async (req, res) => {
  const { name, email, password, organizationId } = req.body;
  
  const existingOrg = await orgService.getOrganizationById(organizationId);
  if (!existingOrg) {
    return apiResponse.badRequest(res, "Organization not found");
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return apiResponse.badRequest(res, "Email already in use");
  }

  const hashedPassword = await passwordConfig.passwordHash(password);
  if (!hashedPassword) return apiResponse.badRequest(res, "Password hashing failed");

  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
    organizationId,
  }, Role.USER);

  const token = tokenConfig.generateToken(user.id, "USER");
  return apiResponse.successResponse(res, "User registered", { ...user, ...token });
});

const genericLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  
  if (!user) return apiResponse.notFound(res, "User not found!");

  const validPassword = await passwordConfig.passwordVerfiy(user.password, password);
  if (!validPassword) {
    return apiResponse.badRequest(res, "Invalid password");
  }

  const token = tokenConfig.generateToken(user.id, "USER");
  return apiResponse.successResponse(res, "Logged in", { ...user, ...token });
});

export default {
  superAdminLogin,
  adminSignup,
  userSignup,
  genericLogin,
};
