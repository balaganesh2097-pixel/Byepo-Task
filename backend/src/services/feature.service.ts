import prisma from "../client";

const createFeatureFlag = async (data: { key: string; isEnabled: boolean; organizationId: string }) => {
  return prisma.featureFlag.create({
    data,
  });
};

const listFeatureFlags = async (organizationId: string) => {
  return prisma.featureFlag.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });
};

const getFeatureFlagById = async (id: string) => {
  return prisma.featureFlag.findUnique({
    where: { id },
  });
};

const getFeatureFlagByKey = async (key: string, organizationId: string) => {
  return prisma.featureFlag.findUnique({
    where: {
      key_organizationId: {
        key,
        organizationId,
      },
    },
  });
};

const updateFeatureFlag = async (id: string, data: { isEnabled?: boolean; key?: string }) => {
  return prisma.featureFlag.update({
    where: { id },
    data,
  });
};

const deleteFeatureFlag = async (id: string) => {
  return prisma.featureFlag.delete({
    where: { id },
  });
};

export default {
  createFeatureFlag,
  listFeatureFlags,
  getFeatureFlagById,
  getFeatureFlagByKey,
  updateFeatureFlag,
  deleteFeatureFlag,
};
