'use server';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Admin } from '@models';

import { sendActivationEmail } from '@lib/server/mailer';
import { withDb } from '@lib/server/withDb';
import { withAuthDb } from '@lib/server/withAuthDb';
import { Credentials } from '../../types/components';

export const registerAdmin = withDb(
  async ({ username, email, password }: Credentials) => {
    if (!username || !password || !email) {
      return { error: 'Missing required fields', ok: false };
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return { error: 'Email or username already in use.', ok: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      username,
      password: hashedPassword,
      activated: false, // New admins are inactive until they activate via email
    });
    const activationToken = crypto.randomBytes(32).toString('hex');

    newAdmin.activationToken = activationToken;
    newAdmin.activationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24 hours

    await newAdmin.save();

    sendActivationEmail({
      username,
      email,
      token: activationToken,
    }).catch((err) => console.error('Activation email failed to send:', err));

    return { ok: true, success: 'Profile created! Please check your mailbox.' };
  },
);

export const activateAccount = withDb(async (token: string) => {
  // 1. Find the user with a valid, non-expired token
  const user = await Admin.findOne({
    activationToken: token,
    activationTokenExpires: { $gt: Date.now() },
  }).select('+activationToken +activationTokenExpires');

  if (!user) {
    return { success: false, message: 'Token is invalid or has expired.' };
  }

  // 2. Perform the update
  user.activated = true;
  user.activationToken = undefined; // Use the one-time-token principle
  user.activationTokenExpires = undefined;

  await user.save();

  return { success: true, message: 'Account verified! You can now log in.' };
});

export const modifyPassword = withAuthDb(async ({ userId, data }) => {
  const { password } = data;

  const updatedUser = await Admin.findByIdAndUpdate(userId, { password });

  if (!updatedUser) throw new Error('Admin not found');

  revalidatePath('/');
  return JSON.parse(JSON.stringify(updatedUser));
});

export const deleteOwnProfile = withAuthDb(async ({ userId }) => {
  const deletedAdmin = await Admin.findByIdAndDelete(userId).select('username');
  if (!deletedAdmin) throw new Error('Admin not found');

  revalidatePath('/');
  return JSON.parse(JSON.stringify(deletedAdmin));
});
