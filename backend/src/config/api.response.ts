import { Response } from "express";

const successResponse = (
  res: Response,
  message?: any,
  data?: any,
  count?: any,
) => {
  return res.status(200).json({
    code: 200,
    ...(message ? { message } : { message: "success" }),
    data,
    count,
  });
};

const badRequest = (res: Response, message?: any) => {
  return res.status(400).json({ code: 400, message });
};

const notFound = (res: Response, message?: any) => {
  return res.status(404).json({ code: 404, message });
};

const unauthorized = (res: Response, message?: any) => {
  return res.status(401).json({
    code: 401,
    ...(message ? { message } : { message: "Unauthorized error!" }),
  });
};

export default {
  successResponse,
  notFound,
  badRequest,
  unauthorized,
};
