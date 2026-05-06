import prisma from "../client";

const getOrganizationById = async (id: string) => {
  return prisma.organization.findUnique({
    where: { id },
  });
};

const findOrganizationByName = async (name: string, excludeId?: string) => {
  return prisma.organization.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

const createOrganization = async (name: string) => {
  return prisma.organization.create({
    data: { name },
  });
};

const listOrganizations = async () => {
  return prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const updateOrganization = async (id: string, name: string) => {
  return prisma.organization.update({
    where: { id },
    data: { name },
  });
};

export default {
  getOrganizationById,
  findOrganizationByName,
  createOrganization,
  listOrganizations,
  updateOrganization,
};
