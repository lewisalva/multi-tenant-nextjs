import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';

import { usersOrganizationsTable } from './db/schema';
import { db } from './db';

type UserOrganization = (typeof usersOrganizationsTable)['$inferSelect'];

const fetchUserInOrganization = ({
  userId,
  organizationId,
  shouldCheckAdmin = false,
}: {
  userId: UserOrganization['userId'];
  organizationId: UserOrganization['organizationId'];
  shouldCheckAdmin?: boolean;
}) => {
  const filters = [
    eq(usersOrganizationsTable.userId, userId),
    eq(usersOrganizationsTable.organizationId, organizationId),
  ];

  if (shouldCheckAdmin) {
    filters.push(eq(usersOrganizationsTable.permission, 'admin'));
  }

  return db.query.usersOrganizationsTable.findFirst({
    where: and(...filters),
    columns: {
      userId: true,
    },
  });
};

export const isUserPlatformAdmin = (user: User): boolean => {
  return user.isPlatformAdmin;
};

export const isUserAuthorizedForOrganization = async (
  user: User,
  organizationId: UserOrganization['organizationId']
): Promise<boolean> => {
  if (isUserPlatformAdmin(user)) {
    return true;
  }

  const result = await fetchUserInOrganization({ userId: user.id, organizationId });

  return result !== undefined;
};

export const isUserAdminForOrganization = async (
  user: User,
  organizationId: UserOrganization['organizationId']
): Promise<boolean> => {
  if (isUserPlatformAdmin(user)) {
    return true;
  }

  const result = await fetchUserInOrganization({
    userId: user.id,
    organizationId,
    shouldCheckAdmin: true,
  });

  return result !== undefined;
};
