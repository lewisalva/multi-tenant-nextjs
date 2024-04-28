/* eslint-disable drizzle/enforce-delete-with-where */
import { afterAll, beforeAll } from 'bun:test';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { runSeeds } from '~/server/db/seeds';
import { db, pgClient } from '~/server/db';
import { organizationsTable, usersOrganizationsTable, usersTable } from '~/server/db/schema';

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await runSeeds();
});

afterAll(async () => {
  await db.delete(usersOrganizationsTable);
  await db.delete(usersTable);
  await db.delete(organizationsTable);
  await pgClient.end();
});
