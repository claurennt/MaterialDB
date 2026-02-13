import { SyntheticEvent } from 'react';
import axios from 'axios';

import { NewLink, NewTopic } from '@types';

import { isNewLink } from '.';
import { getAxiosClient } from '@lib/client';

export const addNewResource = async (
  e: SyntheticEvent,
  token: string,
  payload: NewLink | NewTopic,
) => {
  e.preventDefault();

  const isLink = isNewLink(payload);
  const endpoint = isLink ? `/api/topics/${payload._topic}` : `/api/topics/`;
  const method = isLink ? 'put' : 'post';

  const AxiosClient = getAxiosClient(token);

  // Use a dynamic method (put or post) based on the payload type
  const response = await AxiosClient[method](endpoint, payload);
  return response;
};

export const deleteResource = async (token: string, endpoint: string) => {
  try {
    const AxiosClient = getAxiosClient(token);

    await AxiosClient.delete(endpoint);
  } catch (error) {
    console.log(error);
  }
};

type RegisterAdminParams = {
  action: string;
  data: Record<string, unknown>;
};

export const registerAdmin = async ({ action, data }: RegisterAdminParams) => {
  console.log({ action, data });
  try {
    const registrationOutcome = await axios.post(action, {
      ...data,
    });
    return registrationOutcome;
  } catch (err) {
    console.error('Registration failed: ', err);
    throw err;
  }
};
