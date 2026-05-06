import jwt from "jsonwebtoken";
import moment from "moment";

const createToken = (uid: string, role: string, type: string) => {
  const expireTime = Number(
    type === "ACCESS" ? process.env.ACCESS_EXPIRE : process.env.REFRESH_EXPIRE,
  );

  const duration = type == "ACCESS" ? "minutes" : "days";
  const payload = {
    uid,
    role,
    type,
    iat: moment().unix(),
    exp: moment().add(expireTime, duration).unix(),
  };
  return jwt.sign(payload, process.env.SECRET_KEY!);
};

const generateToken = (userId: string, role: string) => {
  return {
    accessToken: createToken(userId, role, "ACCESS"),
    refershToken: createToken(userId, role, "REFRESH"),
  };
};

export default {
  generateToken,
};
