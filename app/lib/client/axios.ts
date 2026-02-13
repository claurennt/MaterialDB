import axios, { AxiosInstance } from 'axios';

export const getAxiosClient = (AUTH_TOKEN?: string) => {
  const AxiosClient: AxiosInstance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: AUTH_TOKEN,
    },
  });

  return AxiosClient;
};
