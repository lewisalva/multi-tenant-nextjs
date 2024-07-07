import { and, eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { db } from '~/server/db';
import { usersOrganizationsTable } from '~/server/db/schema';

export const selectUserOrganizationSchema = createSelectSchema(usersOrganizationsTable);
export const createUserOrganizationSchema = selectUserOrganizationSchema.pick({
  organizationId: true,
  userId: true,
  permission: true,
}).partial({permission: true});
export const createUserOrganizationWithEmailSchema = selectUserOrganizationSchema.pick({
  organizationId: true,
  userId: true,
  permission: true,
}).partial({permission: true, userId: true}).extend({email: z.string()});

export type UserOrganization = z.infer<typeof selectUserOrganizationSchema>;
export type CreateUserOrganization = z.infer<typeof createUserOrganizationSchema>;
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
