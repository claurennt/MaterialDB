import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Admin } from '../models';

async function globalSetup() {
  await mongoose.connect(process.env.MONGOTESTDB_URI!);

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
  await mongoose.disconnect();
  console.log('✅ Global Setup Complete');
}

export default globalSetup;
