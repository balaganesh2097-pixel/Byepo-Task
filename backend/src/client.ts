import {  PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function prismaClientFunction() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  return new PrismaClient({ adapter });
}

const globalForThis = globalThis as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForThis?.prisma ?? prismaClientFunction();

export default prisma;
