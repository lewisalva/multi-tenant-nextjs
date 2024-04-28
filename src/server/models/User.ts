import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-typebox';
import { type Static, t } from 'elysia';

import { lucia } from '../globalMiddleware/authentication';
import { db } from '~/server/db';
import { usersTable } from '~/server/db/schema';

export const selectUserSchema = createSelectSchema(usersTable);

export const loginUserSchema = t.Object({
  email: t.String({ format: 'email', error: 'Invalid email' }),
  password: t.String({ minLength: 6, error: 'Invalid password' }),
});

export const signUpUserSchema = t.Composite([
  loginUserSchema,
  t.Object({ name: t.String({ minLength: 1, error: 'Invalid name' }) }),
]);

export const updateUserSchema = t.Pick(selectUserSchema, ['name']);

export type User = Static<typeof selectUserSchema>;
export type LoginUser = Static<typeof loginUserSchema>;
export type SignUpUser = Static<typeof signUpUserSchema>;
export type UpdateUser = Static<typeof updateUserSchema>;
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
