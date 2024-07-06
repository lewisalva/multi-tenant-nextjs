import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { authRouter } from './auth/auth.router';

export const app = new Elysia({ prefix: '/api' })
  .use(cors())
  .use(swagger())
  .use(authRouter)
  .onError(({ error }) => {
    console.error(error.stack, 'Uncaught Error');
    return error;
  });

export type API = typeof app;
