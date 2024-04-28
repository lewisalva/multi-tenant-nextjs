import { and, eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-typebox';
import { type Static, t } from 'elysia';

import { db } from '~/server/db';
import { usersOrganizationsTable } from '~/server/db/schema';

export const selectUserOrganizationSchema = createSelectSchema(usersOrganizationsTable);
export const createUserOrganizationSchema = t.Composite([
  t.Pick(selectUserOrganizationSchema, ['organizationId', 'userId']),
  t.Partial(t.Pick(selectUserOrganizationSchema, ['permission'])),
]);
export const createUserOrganizationWithEmailSchema = t.Composite([
  t.Pick(selectUserOrganizationSchema, ['organizationId']),
  t.Partial(t.Pick(selectUserOrganizationSchema, ['userId'])),
  t.Partial(t.Pick(selectUserOrganizationSchema, ['permission'])),
  t.Partial(t.Object({ email: t.String() })),
]);

export type UserOrganization = Static<typeof selectUserOrganizationSchema>;
export type CreateUserOrganization = Static<typeof createUserOrganizationSchema>;
export type UpdateUserOrganization = CreateUserOrganization;
export type DeleteUserOrganization = Omit<CreateUserOrganization, 'permission'>;

export const addUserToOrganization = async (body: CreateUserOrganization) => {
  return db.insert(usersOrganizationsTable).values(body);
};

export const removeUserFromOrganization = async (body: DeleteUserOrganization) => {
  return db
    .delete(usersOrganizationsTable)
    .where(
      and(
        eq(usersOrganizationsTable.userId, body.userId),
        eq(usersOrganizationsTable.organizationId, body.organizationId)
      )
    );
};

export const findUsersInOrganization = (organizationId: UserOrganization['organizationId']) => {
  return db.query.usersOrganizationsTable.findMany({
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
    where: eq(usersOrganizationsTable.organizationId, organizationId),
  });
};

export const updateUserInOrganization = async (body: UpdateUserOrganization) => {
  return db
    .update(usersOrganizationsTable)
    .set({ permission: body.permission })
    .where(
      and(
        eq(usersOrganizationsTable.userId, body.userId),
        eq(usersOrganizationsTable.organizationId, body.organizationId)
      )
    );
};
