import { Request, Response, NextFunction } from "express";
import apiResponse from "../config/api.response";
import { Role } from "../generated/prisma/client";

const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(Role.SUPER_ADMIN) && res.locals.isSuperAdmin) {
      return next();
    }

    const user = res.locals.user;
    if (!user) {
      return apiResponse.unauthorized(res, "User not found");
    }

    if (!roles.includes(user.role)) {
      return apiResponse.unauthorized(res, "Insufficient permissions");
    }

    next();
  };
};

export default requireRole;
