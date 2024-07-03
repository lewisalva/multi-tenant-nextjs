'use server'

import { addUserToOrganization, findUsersInOrganization, removeUserFromOrganization, updateUserInOrganization } from '../../server/models/OrganizationMember';
import { findUserIdByEmail } from '../../server/models/User';
import { type Schema } from '../services/client';
import { queryClient } from '../services/queryClient';

export type OrganizationMembersType =
  Schema['api']['organizations'][':organizationId']['members']['get']['response']['200'];
export type OrganizationMemberType = OrganizationMembersType[number];
export type OrganizationMemberCreateType =
  Schema['api']['organizations'][':organizationId']['members']['post']['body'];
export type OrganizationMemberUpdateType =
  Schema['api']['organizations'][':organizationId']['members'][':userId']['put']['body'];
export type OrganizationMemberDeleteType = Pick<
  OrganizationMemberType,
  'organizationId' | 'userId'
>;

const updateQueryClientWithMembers = (members: OrganizationMembersType): void => {
  members.forEach((member) => {
    queryClient.setQueryData([`member.${member.organizationId}.${member.userId}`], member);
  });
};

export const getOrganizationMembers = async (
  organizationId: OrganizationMemberType['organizationId']
) => {
  const data = await findUsersInOrganization(organizationId);

  setTimeout(() => updateQueryClientWithMembers(data), 0);

  console.log(data);

  return data;
};

export const postOrganizationMember = async (body: OrganizationMemberCreateType) => {
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

export const putOrganizationMember = async (body: OrganizationMemberUpdateType) => {
  await updateUserInOrganization(body);

  return true;
};

export const deleteOrganizationMember = async ({
  organizationId,
  userId,
}: OrganizationMemberDeleteType) => {
  await removeUserFromOrganization({
    userId,
    organizationId,
  });

  return true;
};
