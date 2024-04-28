import { authenticatedClient, type Schema } from './client';

export type UserUpdateType = Schema['api']['users']['me']['put']['body'];
export type User = Schema['api']['users']['me']['get']['response'][200];

export const getUser = async (shouldThrow = false) => {
  const { data, status } = await authenticatedClient.api.users.me.get();

  if (status !== 200 || !data?.id) {
    if (shouldThrow) {
      throw new Error('Failed to fetch user');
    }
    return null;
  }

  return data;
};

export const putUser = async (body: UserUpdateType) => {
  const { status } = await authenticatedClient.api.users.me.put(body);

  if (status !== 204) {
    throw new Error('Failed to update user');
  }

  return true;
};
