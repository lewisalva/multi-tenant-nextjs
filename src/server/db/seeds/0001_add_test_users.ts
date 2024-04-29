import { db } from '../';
import { type User } from '../../models/User';
import { usersTable } from '../schema';

const emailDomain = 'example.com';
const userCount = 100;

export const add_test_users = async () => {
  const users: Pick<User, 'name' | 'email' | 'hashedPassword'>[] = Array.from(
    { length: userCount },
    (_, i) => ({
      name: `Test User ${i + 1}`,
      email: `testuser${i + 1}@${emailDomain}`,
      hashedPassword: Bun.password.hashSync(`${Math.floor(Math.random() * 13124312)}`),
    })
  );

  await db.insert(usersTable).values(users).returning({ userId: usersTable.id });
};
