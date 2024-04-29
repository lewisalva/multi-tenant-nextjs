import { pgClient } from '../';
import { env } from '../../../env';
import { initial_data } from './0000_initial_data';
import { add_test_users } from './0001_add_test_users';

console.log(env.NODE_ENV);

export const runSeeds = async () => {
  await initial_data();

  if (env.NODE_ENV === 'development') {
    await add_test_users();
  }
};

console.log(import.meta.main)

if (import.meta.main) {
  await runSeeds();
  await pgClient.end();
}
