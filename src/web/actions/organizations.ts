'use server';

import { isUserAdminForOrganization, isUserPlatformAdmin } from "../../server/globalMiddleware/authorization";
import { type UpdateOrganization, type CreateOrganization, findOrganizationsForUser, createOrganization, updateOrganization } from "../../server/models/Organization";
import { getUserSession } from "./session";

export const getOrganizations = async () => {
  const { user } = await getUserSession();
  if (!user) throw new Error('Unauthorized');

  return findOrganizationsForUser(user);
};

export const postOrganization = async (body: CreateOrganization) => {
  const { user } = await getUserSession();
  if (!user) throw new Error('Unauthorized');

  const isPlatformAdmin = isUserPlatformAdmin(user);
  if (!isPlatformAdmin) throw new Error('Unauthorized');

  const org = await createOrganization(body)
  if (!org) throw new Error('Failed to create organization');

  return org.id
};

export const putOrganization = async (organizationId: string, body: UpdateOrganization) => {
  const { user } = await getUserSession();
  if (!user) throw new Error('Unauthorized');

  const isOrganizationAdmin = await isUserAdminForOrganization(user, organizationId);
  if (!isOrganizationAdmin) throw new Error('Unauthorized');

  await updateOrganization(body);

  return true;
};
