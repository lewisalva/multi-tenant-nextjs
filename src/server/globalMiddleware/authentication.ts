import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Elysia } from 'elysia';
import { Lucia, verifyRequestOrigin } from 'lucia';

import { sessionsTable, usersTable } from '../db/schema';
import {db} from '../db';
import { env } from '../../env';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      isPlatformAdmin: attributes.isPlatformAdmin,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      isPlatformAdmin: boolean;
    };
  }
}

export const ensureAuthentication = new Elysia()
  .derive({ as: 'scoped' }, async ({ cookie, error, headers, request }) => {
    if (request.method !== 'GET') {
      const originHeader = headers.origin;
      const hostHeader = headers.host;
      if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
        return error(401);
      }
    }

    const cookieHeader = headers.cookie ?? '';
    const sessionId = lucia.readSessionCookie(cookieHeader);
    if (!sessionId) {
      return error(401);
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!(session && user)) {
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookie[sessionCookie.name]?.set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        });
      }
      return error(401);
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
    }

    return {
      user,
      session,
    };
  })
  .macro(({ onBeforeHandle }) => ({
    ensurePlatformAdmin(_value: boolean) {
      onBeforeHandle(({ user, error }) => {
        if (!user?.isPlatformAdmin) {
          return error(401);
        }
      });
    },
  }));
