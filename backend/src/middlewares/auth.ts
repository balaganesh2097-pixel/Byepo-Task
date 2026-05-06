import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import apiResponse from "../config/api.response";
import { userService } from "../services";
import { Role } from "../generated/prisma/client";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return apiResponse.unauthorized(res);

  let decoded: any;

  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY!);
  } catch (error: any) {
    if (error.name == "TokenExpiredError") {
      return apiResponse.unauthorized(res, "Token Expired!");
    }
    return apiResponse.unauthorized(res, "Invalid Token");
  }

  if (decoded.type != "ACCESS")
    return apiResponse.unauthorized(res, "Invalid Token");
  if (decoded.uid === Role.SUPER_ADMIN) {
    res.locals.isSuperAdmin = true;
    return next();
  }

  const user = await userService.getUserById(decoded.uid);

  if (!user || user.deleted)
    return apiResponse.notFound(res, "User not found!");

  res.locals.user = user;
  next();
};

export default auth;
