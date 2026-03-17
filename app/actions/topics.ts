'use server';

import { Link, Topic } from '@models';

import { revalidatePath } from 'next/cache';

import { withAuthDb } from '@lib/server/withAuthDb';
import mongoose from 'mongoose';

export const createTopic = withAuthDb(async ({ userId, data }) => {
  const { name, description } = data;
  const topic = await Topic.create({ name, description, _creator: userId });
  revalidatePath('/');
  return JSON.parse(JSON.stringify(topic));
});

export const updateTopic = withAuthDb(async ({ userId, data }) => {
  const { id, ...updateData } = data;

  const topic = await Topic.findOneAndUpdate(
    { _id: id, _creator: userId },
    { $set: updateData },
    { new: true },
  );

  if (!topic) throw new Error('Topic not found');

  revalidatePath('/');
  return JSON.parse(JSON.stringify(topic));
});

export const deleteTopic = withAuthDb(async ({ userId, data }) => {
  const { id, topicId } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Security check: must own the topic to delete it
    const topic = await Topic.findOneAndDelete(
      { _id: id, _creator: userId },
      { session },
    );
    if (!topic) throw new Error('Topic not found or unauthorized');

    // Remove all links belonging to the deleted topic via the topicId to prevent orphaned links
    await Link.deleteMany({ _topic: topicId, _creator: userId }, { session });

    await session.commitTransaction();
    revalidatePath(`/topics/${topicId}`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
