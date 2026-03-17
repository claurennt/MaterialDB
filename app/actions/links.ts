'use server';

import mongoose from 'mongoose';
import { Link, Topic } from '@models';
import { revalidatePath } from 'next/cache';
import { withAuthDb } from '@lib/server/withAuthDb';
import { scrapeLinkWebsite } from '@lib/server/scraper';

export const createLink = withAuthDb(async ({ userId, data }) => {
  const { url, tags, _topic } = data;

  const title = await scrapeLinkWebsite(url);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newLink = new Link({ title, url, tags, _topic, _creator: userId });
    await newLink.save({ session });

    // 2. Link to the Topic
    await Topic.findByIdAndUpdate(
      _topic,
      { $push: { links: newLink._id } },
      { session },
    );

    await session.commitTransaction();

    // 3. Revalidate the specific topic page so the new link appears
    revalidatePath(`/topics/${_topic}`);

    return JSON.parse(JSON.stringify(newLink));
  } catch (error) {
    await session.abortTransaction();
    throw new Error('Failed to create link');
  } finally {
    session.endSession();
  }
});

export const deleteLink = withAuthDb(async ({ userId, data }) => {
  const { id, topicId } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Security check: must own the link to delete it
    const link = await Link.findOneAndDelete(
      { _id: id, _creator: userId },
      { session },
    );
    if (!link) throw new Error('Link not found or unauthorized');

    // Remove reference from the Topic
    await Topic.findByIdAndUpdate(
      topicId,
      { $pull: { links: id } },
      { session },
    );

    await session.commitTransaction();
    revalidatePath(`/topics/${topicId}`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
