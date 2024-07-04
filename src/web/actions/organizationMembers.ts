'use server'

import { type DeleteUserOrganization, addUserToOrganization, findUsersInOrganization, removeUserFromOrganization, updateUserInOrganization, type UserOrganization, type CreateUserOrganization, type UpdateUserOrganization } from '../../server/models/OrganizationMember';
import { findUserIdByEmail } from '../../server/models/User';
import { queryClient } from '../services/queryClient';

const updateQueryClientWithMembers = (members: UserOrganization[]): void => {
  members.forEach((member) => {
    queryClient.setQueryData([`member.${member.organizationId}.${member.userId}`], member);
  });
};

export const getOrganizationMembers = async (
  organizationId: UserOrganization['organizationId']
) => {
  const data = await findUsersInOrganization(organizationId);

  setTimeout(() => updateQueryClientWithMembers(data), 0);

  console.log(data);

  return data;
};

export const postOrganizationMember = async (body: { email?: string } & Partial<Pick<CreateUserOrganization, 'userId'>> & Omit<CreateUserOrganization, 'userId'>) => {
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
  await updateUserInOrganization(body);

  return true;
};

export const deleteOrganizationMember = async ({
  organizationId,
  userId,
}: DeleteUserOrganization) => {
  await removeUserFromOrganization({
    userId,
    organizationId,
  });

  return true;
};
