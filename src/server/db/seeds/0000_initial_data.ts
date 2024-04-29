import { eq } from 'drizzle-orm';

import { db } from '../';
import { organizationsTable, usersOrganizationsTable, usersTable } from '../schema';
import { env } from '../../../env';

const {
  INITIAL_ADMIN_EMAIL = '',
  INITIAL_ADMIN_PASS = '',
  INITIAL_ADMIN_NAME = '',
  INITIAL_ORG = 'J1Support',
} = env;

export const initial_data = async () => {
  const initialUser: (typeof usersTable)['$inferInsert'] = {
    name: INITIAL_ADMIN_NAME,
    email: INITIAL_ADMIN_EMAIL.toLowerCase(),
    hashedPassword: await Bun.password.hash(INITIAL_ADMIN_PASS),
    isPlatformAdmin: true,
  };

  const initialOrganization: (typeof organizationsTable)['$inferInsert'] = {
    name: INITIAL_ORG,
  };

  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, initialUser.email));

  if (existingUser) {
    return new Error('Initial user already exists');
  }

  const [user] = await db
    .insert(usersTable)
    .values(initialUser)
    .returning({ userId: usersTable.id });

  const [org] = await db
    .insert(organizationsTable)
    .values(initialOrganization)
    .returning({ organizationId: organizationsTable.id });

  await db.insert(usersOrganizationsTable).values({ userId: user!.userId, organizationId: org!.organizationId, permission: 'admin' });
};
