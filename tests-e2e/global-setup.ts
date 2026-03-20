import bcrypt from 'bcrypt';
import { DBClient } from '@lib/server/DBClient';
import { Admin } from '../models';

async function globalSetup() {
  await DBClient();

  const hashedPassword = await bcrypt.hash('password123', 1);

  await Admin.findOneAndUpdate(
    { username: 'test_user' },
    {
      username: 'test_user',
      password: hashedPassword,
      email: 'test@example.com',
    },
    { upsert: true },
  );

  console.log('✅ Test database seeded.');
}

export default globalSetup;
