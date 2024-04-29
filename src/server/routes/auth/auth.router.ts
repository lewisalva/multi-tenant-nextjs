import { Elysia } from 'elysia';

import { signinPost } from './signin.post';
import { signoutPost } from './signout.post';
import { signupPost } from './signup.post';

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(signupPost)
  .use(signinPost)
  .use(signoutPost);
