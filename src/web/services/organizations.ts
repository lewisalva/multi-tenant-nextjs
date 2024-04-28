import { authenticatedClient, type Schema } from './client';

export type OrganizationsType = Schema['api']['organizations']['get']['response']['200'];
export type OrganizationType = OrganizationsType[number];
export type OrganizationCreateType = Schema['api']['organizations']['post']['body'];
export type OrganizationUpdateType =
  Schema['api']['organizations'][':organizationId']['put']['body'];

export const getOrganizations = async () => {
  const { data, status } = await authenticatedClient.api.organizations.get();

  if (status !== 200 || !data) {
    throw new Error('Failed to fetch organizations');
  }

  return data;
};

export const postOrganization = async (body: OrganizationCreateType) => {
  const { data, status } = await authenticatedClient.api.organizations.post(body);

  if (status !== 201 || !data?.id) {
    throw new Error('Failed to create organization');
  }

  return data.id;
};

export const putOrganization = async (organizationId: string, body: OrganizationUpdateType) => {
  const { status } = await authenticatedClient.api.organizations({ organizationId }).put(body);

  if (status !== 204) {
    throw new Error('Failed to update organization');
  }

  return true;
};
