import { treaty } from '@elysiajs/eden';
import { type User } from 'lucia';

import { authRouter } from '~/server/routes/auth/auth.router';
import { organizationsTable, usersOrganizationsTable, usersTable } from '~/server/db/schema';
import { db } from '../db';

const TEST_USER_PASSWORD = process.env.INITIAL_ADMIN_PASS ?? '123456';

type CreateUser = {
  email: string;
  hashedPassword: string;
  isPlatformAdmin: boolean;
  name: string;
  id?: string;
};

const authApi = treaty(authRouter);

const headersMap: Record<string, Headers> = {};

export const getAuthHeaders = async (email = 'lewis@j1.support') => {
  if (headersMap[email]?.has('cookie')) {
    return Object.fromEntries(headersMap[email]!);
  }

  const { headers } = await authApi.auth.signin.post({
    email,
    password: TEST_USER_PASSWORD,
  });

  const [cookie] = (headers as Headers).getSetCookie();

  const newHeaders = new Headers();
  newHeaders.set('cookie', cookie ?? '');
  newHeaders.set('origin', 'http://localhost:3000');
  newHeaders.set('host', 'localhost:3000');

  headersMap[email] = newHeaders;

  return Object.fromEntries(newHeaders);
};

const generateUserInsert = async (name: string, isPlatformAdmin = false): Promise<CreateUser> => ({
  email: `${name}@test.org`.toLowerCase(),
  hashedPassword: await Bun.password.hash(TEST_USER_PASSWORD),
  isPlatformAdmin,
  name,
});

export const generateUsersAndOrgsForTest = async (testName: string) => {
  const usersToInsert = [
    await generateUserInsert(`${testName}.member`),
    await generateUserInsert(`${testName}.admin`),
    await generateUserInsert(`${testName}.platformAdmin`, true),
    await generateUserInsert(`${testName}.otherOrgMember`),
    await generateUserInsert(`${testName}.otherOrgAdmin`),
    await generateUserInsert(`${testName}.platformAdminOrgMember`, true),
    await generateUserInsert(`${testName}.platformAdminOrgAdmin`, true),
    await generateUserInsert(`${testName}.platformAdminOtherOrgMember`, true),
    await generateUserInsert(`${testName}.platformAdminOtherOrgAdmin`, true),
  ];

  const orgsToInsert = [{ name: testName }, { name: `${testName}.otherOrg` }];

  const orgIds = await db
    .insert(organizationsTable)
    .values(orgsToInsert)
    .returning({ id: organizationsTable.id });

  const userIds = await db
    .insert(usersTable)
    .values(usersToInsert)
    .returning({ id: usersTable.id });

  await db.insert(usersOrganizationsTable).values([
    { userId: userIds[0]!.id, organizationId: orgIds[0]!.id }, // member
    { userId: userIds[1]!.id, organizationId: orgIds[0]!.id, permission: 'admin' }, // admin
    { userId: userIds[3]!.id, organizationId: orgIds[1]!.id }, // otherOrgMember
    { userId: userIds[4]!.id, organizationId: orgIds[1]!.id, permission: 'admin' }, // otherOrgAdmin
    { userId: userIds[5]!.id, organizationId: orgIds[0]!.id }, // platformAdminOrgMember
    { userId: userIds[6]!.id, organizationId: orgIds[0]!.id, permission: 'admin' }, // platformAdminOrgAdmin
    { userId: userIds[7]!.id, organizationId: orgIds[1]!.id }, // platformAdminOtherOrgMember
    { userId: userIds[8]!.id, organizationId: orgIds[1]!.id, permission: 'admin' }, // platformAdminOtherOrgAdmin
  ]);

  return {
    users: {
      member: {
        ...usersToInsert[0]!,
        id: userIds[0]!.id,
      },
      admin: {
        ...usersToInsert[1]!,
        id: userIds[1]!.id,
      },
      platformAdmin: {
        ...usersToInsert[2]!,
        id: userIds[2]!.id,
      },
      otherOrgMember: {
        ...usersToInsert[3]!,
        id: userIds[3]!.id,
      },
      otherOrgAdmin: {
        ...usersToInsert[4]!,
        id: userIds[4]!.id,
      },
      platformAdminOrgMember: {
        ...usersToInsert[5]!,
        id: userIds[5]!.id,
      },
      platformAdminOrgAdmin: {
        ...usersToInsert[6]!,
        id: userIds[6]!.id,
      },
      platformAdminOtherOrgMember: {
        ...usersToInsert[7]!,
        id: userIds[7]!.id,
      },
      platformAdminOtherOrgAdmin: {
        ...usersToInsert[8]!,
        id: userIds[8]!.id,
      },
    },
    orgs: {
      organization: {
        id: orgIds[0]!.id,
        name: testName,
      },
      otherOrganization: {
        id: orgIds[1]!.id,
        name: `${testName}.otherOrg`,
      },
    },
  };
};

export type GenerateUsersAndOrgsType = Awaited<ReturnType<typeof generateUsersAndOrgsForTest>>;

export const toSimpleUser = (user: CreateUser): User => ({
  email: user.email,
  id: user.id + '',
  isPlatformAdmin: user.isPlatformAdmin,
});
