import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';

import { lucia } from '../authentication';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { z } from 'zod';

export const selectUserSchema = createSelectSchema(usersTable);

export const loginUserSchema = z.object({
  email: z.string({ message: 'Invalid email' }).email(),
  password: z.string({ message: 'Invalid password' }).min(6),
});

export const signUpUserSchema = loginUserSchema.extend({ name: z.string({ message: 'Invalid name' }).min(1) });

export const updateUserSchema = selectUserSchema.pick({ name: true });

export type User = z.infer<typeof selectUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type SignUpUser = z.infer<typeof signUpUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type SimpleUser = Pick<User, 'id' | 'email' | 'name' | 'isPlatformAdmin'>;

export const findUserIdByEmail = async (email: User['email']) => {
  const response = await db.query.usersTable.findFirst({
    columns: { id: true },
    where: eq(usersTable.email, email.toLowerCase()),
  });

  return response?.id;
};

export const findUserByEmail = (email: User['email']) => {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.email, email.toLowerCase()),
  });
};

export const findUser = (userId: User['id']) => {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: { id: true, email: true, name: true, isPlatformAdmin: true },
  });
};

export const checkUserPassword = async ({ email, password }: LoginUser) => {
  const user = await findUserByEmail(email);

  if (!user || !(await Bun.password.verify(password, user.hashedPassword))) {
    return undefined;
  }

  return user;
};

export const createSessionCookie = async (userId: User['id']) => {
  const session = await lucia.createSession(userId, {});
  return lucia.createSessionCookie(session.id);
};

export const createUser = async ({ email, password, name }: SignUpUser) => {
  const hashedPassword = await Bun.password.hash(password);

  const [user] = await db
    .insert(usersTable)
    .values({ email: email.toLowerCase(), hashedPassword, name })
    .returning({ userId: usersTable.id });

  if (!user) {
    throw new Error('Failed to create user');
  }

  return user.userId;
};

export const updateUser = (userId: User['id'], { name }: UpdateUser) => {
  return db.update(usersTable).set({ name }).where(eq(usersTable.id, userId));
};
