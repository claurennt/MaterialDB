import { NewLink, NewTopic } from '@types';
import { getAxiosClient } from 'utils/server/axios';
import { toast } from 'react-toastify';

const isNewLink = (payload: any): payload is NewLink & { _topic: string } =>
  (payload as NewLink).url in payload;

export const addNewResource = async (
  e: React.MouseEvent,
  token: string,
  payload: NewLink | NewTopic
) => {
  e.preventDefault();

  const isLink = isNewLink(payload);
  const endpoint = isLink ? `/api/topics/${payload._topic}` : `/api/topics/`;
  const method = isLink ? 'put' : 'post';

  try {
    const AxiosClient = getAxiosClient(token);

    // Use a dynamic method (put or post) based on the payload type
    await AxiosClient[method](endpoint, payload);

    toast.success(
      `The ${isLink ? 'link' : 'topic'} has been successfully created.`
    );
  } catch (error) {
    console.error(error);
    toast.error(
      `The ${isLink ? 'link' : 'topic'} was not created. Please try again.`
    );
  }
};

export const deleteResource = async (token: string, endpoint: string) => {
  try {
    const AxiosClient = getAxiosClient(token);

    await AxiosClient.delete(endpoint);
  } catch (error) {
    toast.error('The resource was not deleted.');
  }
};
