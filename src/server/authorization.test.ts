import { beforeAll, describe, expect, test } from 'bun:test';

import {
  generateUsersAndOrgsForTest,
  type GenerateUsersAndOrgsType,
  toSimpleUser,
} from './tests/utils';
import {
  isUserAdminForOrganization,
  isUserAuthorizedForOrganization,
  isUserPlatformAdmin,
} from './authorization';

describe('Authorization middleware', () => {
  let generatedData: GenerateUsersAndOrgsType;

  beforeAll(async () => {
    generatedData = await generateUsersAndOrgsForTest('authorization.middleware');
  });

  /* Access Table
  | user            | Platform Admin | Admin Access | Org Access |
  |-----------------|----------------|--------------|------------|
  | otherMember     |       🛑       |      🛑      |     🛑     |
  | otherAdmin      |       🛑       |      🛑      |     🛑     |
  | member          |       🛑       |      🛑      |     ✅     |
  | admin           |       🛑       |      ✅      |     ✅     |
  | platformAdmin   |       ✅       |      ✅      |     ✅     |
  */

  describe('isUserAuthorizedForOrganization', () => {
    test('should return true if is authorized, false otherwise', async () => {
      expect(
        await isUserAuthorizedForOrganization(
          toSimpleUser(generatedData.users.otherOrgMember),
          generatedData.orgs.organization.id
        )
      ).toEqual(false);
      expect(
        await isUserAuthorizedForOrganization(
          toSimpleUser(generatedData.users.otherOrgAdmin),
          generatedData.orgs.organization.id
        )
      ).toEqual(false);
      expect(
        await isUserAuthorizedForOrganization(
          toSimpleUser(generatedData.users.member),
          generatedData.orgs.organization.id
        )
      ).toEqual(true);
      expect(
        await isUserAuthorizedForOrganization(
          toSimpleUser(generatedData.users.admin),
          generatedData.orgs.organization.id
        )
      ).toEqual(true);
      expect(
        await isUserAuthorizedForOrganization(
          toSimpleUser(generatedData.users.platformAdmin),
          generatedData.orgs.organization.id
        )
      ).toEqual(true);
    });
  });

  describe('isUserAdminForOrganization', () => {
    test('should return true if is admin, false otherwise', async () => {
      expect(
        await isUserAdminForOrganization(
          toSimpleUser(generatedData.users.otherOrgMember),
          generatedData.orgs.organization.id
        )
      ).toEqual(false);
      expect(
        await isUserAdminForOrganization(
          toSimpleUser(generatedData.users.otherOrgAdmin),
          generatedData.orgs.organization.id
        )
      ).toEqual(false);
      expect(
        await isUserAdminForOrganization(
          toSimpleUser(generatedData.users.member),
          generatedData.orgs.organization.id
        )
      ).toEqual(false);
      expect(
        await isUserAdminForOrganization(
          toSimpleUser(generatedData.users.admin),
          generatedData.orgs.organization.id
        )
      ).toEqual(true);
      expect(
        await isUserAdminForOrganization(
          toSimpleUser(generatedData.users.platformAdmin),
          generatedData.orgs.organization.id
        )
      ).toEqual(true);
    });
  });

  describe('isUserPlatformAdmin', () => {
    test('should return true if is platform admin, false otherwise', async () => {
      expect(isUserPlatformAdmin(toSimpleUser(generatedData.users.otherOrgMember))).toEqual(false);
      expect(isUserPlatformAdmin(toSimpleUser(generatedData.users.otherOrgAdmin))).toEqual(false);
      expect(isUserPlatformAdmin(toSimpleUser(generatedData.users.member))).toEqual(false);
      expect(isUserPlatformAdmin(toSimpleUser(generatedData.users.admin))).toEqual(false);
      expect(isUserPlatformAdmin(toSimpleUser(generatedData.users.platformAdmin))).toEqual(true);
    });
  });
});
