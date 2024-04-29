import { treaty } from '@elysiajs/eden';
import { beforeAll, describe, expect, spyOn, test } from 'bun:test';

import {
  generateUsersAndOrgsForTest,
  type GenerateUsersAndOrgsType,
  getAuthHeaders,
} from '~/server/tests/utils';
import * as OrganizationMemberModel from '~/server/models/OrganizationMember';
import { createUser } from '~/server/models/User';
import { organizationsRouter } from '../organizations.router';

const organizationsApi = treaty(organizationsRouter);

//TODO: add tests for non platform admins
describe('members.router', () => {
  let generatedData: GenerateUsersAndOrgsType;

  beforeAll(async () => {
    generatedData = await generateUsersAndOrgsForTest('members.router');
  });

  test('e2e management of organization members as admin', async () => {
    const newUser = {
      email: 'members.router.e2e@test.org',
      password: '123456',
      name: 'members.router.e2e',
    };
    const newUserId = await createUser(newUser);

    const headers = await getAuthHeaders(generatedData.users.admin.email);

    const initialMembers = await OrganizationMemberModel.findUsersInOrganization(
      generatedData.orgs.organization.id
    );
    expect(initialMembers.length).not.toBe(undefined);

    const { status: addStatus } = await organizationsApi
      .organizations({ organizationId: generatedData.orgs.organization.id })
      .members.post(
        {
          userId: newUserId,
          organizationId: generatedData.orgs.organization.id,
        },
        { headers }
      );
    expect(addStatus).toBe(201);

    expect(
      (await OrganizationMemberModel.findUsersInOrganization(generatedData.orgs.organization.id))
        .length
    ).toBe(initialMembers.length + 1);

    const { status: updateStatus } = await organizationsApi
      .organizations({ organizationId: generatedData.orgs.organization.id })
      .members({ userId: newUserId })
      .put(
        {
          userId: newUserId,
          permission: 'admin',
          organizationId: generatedData.orgs.organization.id,
        },
        { headers }
      );
    expect(updateStatus).toBe(204);

    const { status: removeStatus } = await organizationsApi
      .organizations({ organizationId: generatedData.orgs.organization.id })
      .members({ userId: newUserId })
      .delete({}, { headers });
    expect(removeStatus).toBe(204);

    expect(
      (await OrganizationMemberModel.findUsersInOrganization(generatedData.orgs.organization.id))
        .length
    ).toBe(initialMembers.length);
  });

  describe('get /organizations/:organizationId/members', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi
        .organizations({ organizationId: generatedData.orgs.organization.id })
        .members.get({});

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    const expected: Record<
      keyof GenerateUsersAndOrgsType['users'],
      { isSuccess: boolean; expectedValue: number }
    > = {
      admin: { isSuccess: true, expectedValue: 4 },
      member: { isSuccess: false, expectedValue: 999 },
      otherOrgAdmin: { isSuccess: false, expectedValue: 999 },
      otherOrgMember: { isSuccess: false, expectedValue: 999 },
      platformAdmin: { isSuccess: true, expectedValue: 4 },
      platformAdminOrgAdmin: { isSuccess: true, expectedValue: 4 },
      platformAdminOrgMember: { isSuccess: true, expectedValue: 4 },
      platformAdminOtherOrgMember: { isSuccess: true, expectedValue: 4 },
      platformAdminOtherOrgAdmin: { isSuccess: true, expectedValue: 4 },
    } as const;

    Object.entries(expected).forEach(([user, expected]) => {
      test(`it returns a list of members in an organization, if authorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const { status, data } = await organizationsApi
          .organizations({ organizationId: generatedData.orgs.organization.id })
          .members.get({ headers });

        if (expected.isSuccess) {
          expect(status).toEqual(200);
          expect(data?.length).toEqual(expected.expectedValue);
        } else {
          expect(status).toEqual(401);
        }
      });
    });
  });

  describe('post /organizations/:organizationId/members', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await organizationsApi
        .organizations({ organizationId: generatedData.orgs.organization.id })
        .members.post({ userId: 'someId', organizationId: generatedData.orgs.organization.id });

      expect(status).toEqual(401);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Unauthorized');
    });

    test('it throws 400 when org id in params and body are a mismatch', async () => {
      const headers = await getAuthHeaders(generatedData.users.admin.email);

      const { status, error } = await organizationsApi
        .organizations({ organizationId: generatedData.orgs.organization.id })
        .members.post(
          {
            userId: 'someId',
            organizationId: generatedData.orgs.otherOrganization.id,
          },
          { headers }
        );

      expect(status).toEqual(400);
      expect(error?.value).toEqual('Bad Request');
    });

    test('it allows adding a member to an organization by email', async () => {
      const headers = await getAuthHeaders();

      const spy = spyOn(OrganizationMemberModel, 'addUserToOrganization').mockReturnValueOnce(
        // @ts-expect-error override for mock
        Promise.resolve()
      );

      const { status } = await organizationsApi
        .organizations({ organizationId: generatedData.orgs.organization.id })
        .members.post(
          {
            email: generatedData.users.member.email,
            permission: 'member',
            organizationId: generatedData.orgs.organization.id,
          },
          { headers }
        );

      expect(status).toEqual(201);

      spy.mockRestore();
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
      test(`it adds a member to an organization, if authorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const spy = spyOn(OrganizationMemberModel, 'addUserToOrganization').mockReturnValueOnce(
          // @ts-expect-error override for mock
          Promise.resolve()
        );

        const { status } = await organizationsApi
          .organizations({ organizationId: generatedData.orgs.organization.id })
          .members.post(
            {
              userId: generatedData.users.member.id,
              permission: 'member',
              organizationId: generatedData.orgs.organization.id,
            },
            { headers }
          );

        if (expected.isSuccess) {
          expect(status).toEqual(201);
        } else {
          expect(status).toEqual(401);
        }

        spy.mockRestore();
      });

      test(`it removes a member from an organization, if autorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const spy = spyOn(
          OrganizationMemberModel,
          'removeUserFromOrganization'
        ).mockReturnValueOnce(
          // @ts-expect-error override for mock
          Promise.resolve()
        );

        const { status } = await organizationsApi
          .organizations({ organizationId: generatedData.orgs.organization.id })
          .members({ userId: 'someId' })
          .delete({}, { headers });

        if (expected.isSuccess) {
          expect(status).toEqual(204);
        } else {
          expect(status).toEqual(401);
        }

        spy.mockRestore();
      });

      test(`it updates a member in an organization, if authorized, as ${user}`, async () => {
        const headers = await getAuthHeaders(
          generatedData.users[user as keyof GenerateUsersAndOrgsType['users']].email
        );

        const spy = spyOn(OrganizationMemberModel, 'updateUserInOrganization').mockReturnValueOnce(
          // @ts-expect-error override for mock
          Promise.resolve()
        );

        const { status } = await organizationsApi
          .organizations({ organizationId: generatedData.orgs.organization.id })
          .members({ userId: 'someId' })
          .put(
            {
              userId: 'someId',
              permission: 'admin',
              organizationId: generatedData.orgs.organization.id,
            },
            { headers }
          );

        if (expected.isSuccess) {
          expect(status).toEqual(204);
        } else {
          expect(status).toEqual(401);
        }

        spy.mockRestore();
      });
    });
  });
});
