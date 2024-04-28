import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/* Table Definitions */
export const organizationsTable = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().default(''),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  isPlatformAdmin: boolean('is_platform_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessionsTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const userPermissionsEnum = pgEnum('permission', ['member', 'admin']);
export const usersOrganizationsTable = pgTable(
  'users_organizations',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizationsTable.id, { onDelete: 'cascade' }),
    permission: userPermissionsEnum('permission').notNull().default('member'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    };
  }
);

/* Relation Definitions */
export const organizationRelations = relations(organizationsTable, ({ many }) => ({
  users: many(usersOrganizationsTable),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  organizations: many(usersOrganizationsTable),
}));

export const usersOrgnaizationsRelations = relations(usersOrganizationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [usersOrganizationsTable.organizationId],
    references: [organizationsTable.id],
  }),
  user: one(usersTable, {
    fields: [usersOrganizationsTable.userId],
    references: [usersTable.id],
  }),
}));
