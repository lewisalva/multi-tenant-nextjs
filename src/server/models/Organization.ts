import { and, asc, eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-typebox';
import { type Static, t } from 'elysia';
import { type User } from 'lucia';

import { db } from '~/server/db';
import { organizationsTable, usersOrganizationsTable } from '~/server/db/schema';

export const selectOrganizationSchema = createSelectSchema(organizationsTable);
export const createOrganizationSchema = t.Pick(selectOrganizationSchema, ['name']);

export type Organization = Static<typeof selectOrganizationSchema>;
export type CreateOrganization = Static<typeof createOrganizationSchema>;
export type UpdateOrganization = Pick<Organization, 'id' | 'name'>;

export const findOrganizationsForUser = (user: User) => {
  const query = db.select().from(organizationsTable);

  if (!user.isPlatformAdmin) {
    void query.innerJoin(
      usersOrganizationsTable,
      and(
        eq(organizationsTable.id, usersOrganizationsTable.organizationId),
        eq(usersOrganizationsTable.userId, user.id)
      )
    );
  }

  return query.orderBy(asc(organizationsTable.updatedAt));
};

export const createOrganization = async (organization: CreateOrganization) => {
  const [newOrganization] = await db
    .insert(organizationsTable)
    .values(organization)
    .returning({ id: organizationsTable.id });

  return newOrganization;
};

export const updateOrganization = (organization: UpdateOrganization) => {
  return db
    .update(organizationsTable)
    .set(organization)
    .where(eq(organizationsTable.id, organization.id));
};

export const deleteOrganization = (organizationId: Organization['id']) => {
  return db.delete(organizationsTable).where(eq(organizationsTable.id, organizationId));
};
