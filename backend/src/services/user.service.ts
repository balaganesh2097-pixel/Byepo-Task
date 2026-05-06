import prisma from "../client";
import { Role } from "../generated/prisma/client";


const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const createUser = async (data: any, role: Role) => {
  return prisma.user.create({
    data: {
      ...data,
      role,
    },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email, deleted: false },
  });
};


export default {
  createUser,
  getUserByEmail,
  getUserById,
};
