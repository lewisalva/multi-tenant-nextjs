import { authenticatedClient, type Schema } from './client';
import { queryClient } from './queryClient';

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
  const { data, status } = await authenticatedClient.api
    .organizations({ organizationId })
    .members.get();

  if (status !== 200 || !data) {
    throw new Error('Failed to fetch organization members');
  }

  window.setTimeout(() => updateQueryClientWithMembers(data), 0);

  console.log(data);

  return data;
};

export const postOrganizationMember = async (body: OrganizationMemberCreateType) => {
  const { status } = await authenticatedClient.api
    .organizations({ organizationId: body.organizationId })
    .members.post(body);

  if (status !== 201) {
    throw new Error('Failed to create organization member');
  }

  return true;
};

export const putOrganizationMember = async (body: OrganizationMemberUpdateType) => {
  const { status } = await authenticatedClient.api
    .organizations({ organizationId: body.organizationId })
    .members({ userId: body.userId })
    .put(body);

  if (status !== 204) {
    throw new Error('Failed to update organization member');
  }

  return true;
};

export const deleteOrganizationMember = async ({
  organizationId,
  userId,
}: OrganizationMemberDeleteType) => {
  const { status } = await authenticatedClient.api
    .organizations({ organizationId })
    .members({ userId })
    .delete();

  if (status !== 204) {
    throw new Error('Failed to delete organization member');
  }

  return true;
};
