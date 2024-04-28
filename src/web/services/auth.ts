import { authenticatedClient, client, type Schema } from './client';

export type SignInBody = Schema['api']['auth']['signin']['post']['body'];
export type SignUpBody = Schema['api']['auth']['signup']['post']['body'];

export const signin = async (body: SignInBody) => {
  const response = await client.api.auth.signin.post(body);

  if (response.status !== 204) {
    throw new Error('Sign in failed.');
  }

  return true;
};
export const signup = async (body: SignUpBody) => {
  const response = await client.api.auth.signup.post(body);

  if (response.status !== 201) {
    throw new Error('Signup failed.');
  }

  return true;
};

export const signout = async () => {
  const response = await authenticatedClient.api.auth.signout.post();

  if (response.status !== 204) {
    throw new Error('Sign out failed.');
  }

  return true;
};
