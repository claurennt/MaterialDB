import { NewLink, NewTopic } from '@types';
import { getAxiosClient } from 'utils/server/axios';

const isNewLink = (payload: any): payload is NewLink & { _topic: string } =>
  'url' in payload;

export const addNewResource = async (
  e: React.MouseEvent,
  token: string,
  payload: NewLink | NewTopic
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
