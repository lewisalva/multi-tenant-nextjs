'use server';

import { type DeleteUserOrganization, addUserToOrganization, findUsersInOrganization, removeUserFromOrganization, updateUserInOrganization, type UserOrganization, type CreateUserOrganization, type UpdateUserOrganization } from '../../server/models/OrganizationMember';
import { findUserIdByEmail } from '../../server/models/User';
import { queryClient } from '../utilities/queryClient';
import { isUserAdminForOrganization } from '../../server/authorization';
import { getUserSession } from './session';



const authorizeUser = async (organizationId: UserOrganization['organizationId']) => {
  const {user} = await getUserSession();
  if (!user) throw new Error('Unauthorized');

  const isOrganizationAdmin = await isUserAdminForOrganization(user, organizationId)

  if (!isOrganizationAdmin) throw new Error('Unauthorized');
}

const updateQueryClientWithMembers = (members: UserOrganization[]): void => {
  members.forEach((member) => {
    queryClient.setQueryData([`member.${member.organizationId}.${member.userId}`], member);
  });
};

export const getOrganizationMembers = async (
  organizationId: UserOrganization['organizationId']
) => {
  await authorizeUser(organizationId)

  const data = await findUsersInOrganization(organizationId);

  setTimeout(() => updateQueryClientWithMembers(data), 0);

  return data;
};
export type OrganizationMembers = Awaited<ReturnType<typeof getOrganizationMembers>>

export const postOrganizationMember = async (body: { email?: string } & Partial<Pick<CreateUserOrganization, 'userId'>> & Omit<CreateUserOrganization, 'userId'>) => {
  await authorizeUser(body.organizationId)

  let userId = body.userId;
  if (body.email) {
    userId = await findUserIdByEmail(body.email);
  }

  if (!userId) {
    return false
  }

  await addUserToOrganization({
    userId,
    organizationId: body.organizationId,
    permission: body.permission,
  });

  return true;
};

export const putOrganizationMember = async (body: UpdateUserOrganization) => {
  await authorizeUser(body.organizationId)

  await updateUserInOrganization(body);

  return true;
};

export const deleteOrganizationMember = async ({
  organizationId,
  userId,
}: DeleteUserOrganization) => {
  await authorizeUser(organizationId)

  await removeUserFromOrganization({
    userId,
    organizationId,
  });

  return true;
};
