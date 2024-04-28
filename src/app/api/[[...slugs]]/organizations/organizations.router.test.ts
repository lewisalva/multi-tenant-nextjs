import { treaty } from '@elysiajs/eden';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { eq } from 'drizzle-orm';

import {
  generateUsersAndOrgsForTest,
  type GenerateUsersAndOrgsType,
  getAuthHeaders,
} from '~/server/tests/utils';
import { db } from '~/server/db';
import { organizationsTable } from '~/server/db/schema';
import { organizationsRouter } from './organizations.router';

const organizationsApi = treaty(organizationsRouter);

describe('organizations.router', () => {
  let generatedData: GenerateUsersAndOrgsType;

  beforeAll(async () => {
    generatedData = await generateUsersAndOrgsForTest('organizations.router');
  });

  describe('get /organizations', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi.organizations.get();

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    const expected: Record<
      keyof GenerateUsersAndOrgsType['users'],
      { isSuccess: boolean; expectedValue: number }
    > = {
      admin: { isSuccess: true, expectedValue: 1 },
      member: { isSuccess: true, expectedValue: 1 },
      otherOrgAdmin: { isSuccess: true, expectedValue: 1 },
      otherOrgMember: { isSuccess: true, expectedValue: 1 },
      platformAdmin: { isSuccess: true, expectedValue: 1 },
      platformAdminOrgAdmin: { isSuccess: true, expectedValue: 1 },
      platformAdminOrgMember: { isSuccess: true, expectedValue: 1 },
      platformAdminOtherOrgMember: { isSuccess: true, expectedValue: 1 },
      platformAdminOtherOrgAdmin: { isSuccess: true, expectedValue: 1 },
    } as const;

    Object.entries(expected).forEach(([user, expected]) => {
      test(`it returns list of orgs for the user (${user})`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const { status, data } = await organizationsApi.organizations.get({ headers });

        if (expected.isSuccess) {
          expect(status).toEqual(200);
          expect(data?.length).toBeGreaterThanOrEqual(expected.expectedValue);
        } else {
          expect(status).toEqual(401);
        }
      });
    });
  });

  describe('post /organizations', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi.organizations.post({ name: 'Test Org' });

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    const expected: Record<keyof GenerateUsersAndOrgsType['users'], { isSuccess: boolean }> = {
      admin: { isSuccess: false },
      member: { isSuccess: false },
      otherOrgAdmin: { isSuccess: false },
      otherOrgMember: { isSuccess: false },
      platformAdmin: { isSuccess: true },
      platformAdminOrgAdmin: { isSuccess: true },
      platformAdminOrgMember: { isSuccess: true },
      platformAdminOtherOrgMember: { isSuccess: true },
      platformAdminOtherOrgAdmin: { isSuccess: true },
    } as const;

    Object.entries(expected).forEach(([user, expected]) => {
      test(`it creates an organization for platform admins only - ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const { data, status } = await organizationsApi.organizations.post(
          { name: 'Test Org' },
          { headers }
        );

        if (expected.isSuccess) {
          expect(status).toEqual(201);
          expect(data).toHaveProperty('id');
        } else {
          expect(status).toEqual(401);
        }
      });
    });
  });

  describe('delete /organizations/:organizationId', () => {
    let organizationId: string;
    beforeEach(async () => {
      const [newOrg] = await db
        .insert(organizationsTable)
        .values({ name: 'delete org' })
        .returning({ id: organizationsTable.id });

      organizationId = newOrg!.id;
    });

    afterEach(async () => {
      try {
        await db.delete(organizationsTable).where(eq(organizationsTable.id, organizationId));
      } catch (e) {
        /* empty, we're just ensuring that the org was deleted */
      }
    });

    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi.organizations({ organizationId }).delete({});

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    const expected: Record<keyof GenerateUsersAndOrgsType['users'], { isSuccess: boolean }> = {
      admin: { isSuccess: false },
      member: { isSuccess: false },
      otherOrgAdmin: { isSuccess: false },
      otherOrgMember: { isSuccess: false },
      platformAdmin: { isSuccess: true },
      platformAdminOrgAdmin: { isSuccess: true },
      platformAdminOrgMember: { isSuccess: true },
      platformAdminOtherOrgMember: { isSuccess: true },
      platformAdminOtherOrgAdmin: { isSuccess: true },
    } as const;

    Object.entries(expected).forEach(([user, expected]) => {
      test(`it deletes an organization, if authorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const { status } = await organizationsApi
          .organizations({ organizationId })
          .delete({}, { headers });

        if (expected.isSuccess) {
          expect(status).toEqual(204);
        } else {
          expect(status).toEqual(401);
        }
      });
    });
  });

  describe('put /organizations/:organizationId', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi
        .organizations({ organizationId: 'someId' })
        .put({
          name: 'Updated Org',
        });

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    const expected: Record<keyof GenerateUsersAndOrgsType['users'], { isSuccess: boolean }> = {
      admin: { isSuccess: true },
      member: { isSuccess: false },
      otherOrgAdmin: { isSuccess: false },
      otherOrgMember: { isSuccess: false },
      platformAdmin: { isSuccess: true },
      platformAdminOrgAdmin: { isSuccess: true },
      platformAdminOrgMember: { isSuccess: true },
      platformAdminOtherOrgMember: { isSuccess: true },
      platformAdminOtherOrgAdmin: { isSuccess: true },
    } as const;

    Object.entries(expected).forEach(([user, expected]) => {
      test(`it updates an organization, if authorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const { status } = await organizationsApi
          .organizations({ organizationId: generatedData.orgs.organization.id })
          .put({ name: `Updated Org - ${user}` }, { headers });

        if (expected.isSuccess) {
          expect(status).toEqual(204);
        } else {
          expect(status).toEqual(401);
        }
      });
    });
  });
});
