'use server';

import { type UpdateUser, findUser, updateUser } from "../../server/models/User";
import { getUserSession } from "./session";

export const getUser = async (shouldThrow = false) => {
  const {user: userSession} = await getUserSession();
  if (!userSession) {
    if (shouldThrow) throw new Error('Unauthorized');
    return null;
  }

  return findUser(userSession.id);
};

export const putUser = async (body: UpdateUser) => {
  const {user} = await getUserSession();
  if (!user) throw new Error('Unauthorized');

  await updateUser(user.id, body);

  return true;
};
