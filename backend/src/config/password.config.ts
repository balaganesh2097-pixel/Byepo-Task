import argon2 from "argon2";

const passwordHash = async (password: string) => {
  try {
    return argon2.hash(password);
  } catch (error) {
    return null;
  }
};

const passwordVerfiy = async (passwordHash: string, password: string) => {
  try {
    if (await argon2.verify(passwordHash, password)) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export default {
  passwordHash,
  passwordVerfiy,
};
