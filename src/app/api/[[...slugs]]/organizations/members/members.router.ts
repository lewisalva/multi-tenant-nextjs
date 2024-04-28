import Elysia from 'elysia';

import { ensureAuthentication } from '~/server/globalMiddleware/authentication';
import { isUserAdminForOrganization } from '~/server/globalMiddleware/authorization';
import {
  addUserToOrganization,
  createUserOrganizationSchema,
  createUserOrganizationWithEmailSchema,
  findUsersInOrganization,
  removeUserFromOrganization,
  updateUserInOrganization,
} from '~/server/models/OrganizationMember';
import { findUserIdByEmail } from '~/server/models/User';

export const membersRouter = new Elysia().use(ensureAuthentication).group(
  '/:organizationId/members',
  {
    beforeHandle: async ({ error, params, user }) => {
      const isOrganizationAdmin = await isUserAdminForOrganization(user, params.organizationId);
      if (!isOrganizationAdmin) {
        return error(401);
      }
    },
  },
  (app) =>
    app
      .get('', ({ params }) => {
        return findUsersInOrganization(params.organizationId);
      })
      .post(
        '',
        async ({ body, error, params, set }) => {
          if (body.organizationId !== params.organizationId) {
            return error(400);
          }

          let userId = body.userId;
          if (body.email) {
            userId = await findUserIdByEmail(body.email);
          }

          if (!userId) {
            return error(404);
          }

          await addUserToOrganization({
            userId,
            organizationId: params.organizationId,
            permission: body.permission,
          });

          set.status = 201;
        },
        { body: createUserOrganizationWithEmailSchema }
      )
      .delete('/:userId', async ({ params, set }) => {
        await removeUserFromOrganization({
          userId: params.userId,
          organizationId: params.organizationId,
        });

        set.status = 204;
      })
      .put(
        '/:userId',
        async ({ body, error, params, set }) => {
          if (body.organizationId !== params.organizationId || body.userId !== params.userId) {
            return error(400);
          }

          await updateUserInOrganization(body);

          set.status = 204;
        },
        { body: createUserOrganizationSchema }
      )
);
