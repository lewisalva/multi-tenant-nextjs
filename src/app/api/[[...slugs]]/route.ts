import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { authRouter } from './auth/auth.router';
import { organizationsRouter } from './organizations/organizations.router';
import { usersRouter } from './users/users.router';
// import { loggerMiddleware } from '~/server/globalMiddleware/logger';

export const app = new Elysia({ prefix: '/api' })
  // .use(loggerMiddleware)
  .use(cors())
  .use(swagger())
  .use(authRouter)
  .use(usersRouter)
  .use(organizationsRouter)
  .onError(({ error }) => {
    console.error(error.stack, 'Uncaught Error');
    return error;
  });

export type API = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
