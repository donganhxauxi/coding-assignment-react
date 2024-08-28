import { User } from '@acme/shared-models';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useGetUsers = () => {
  return useQuery<User[]>('users', async () => {
    const { data } = await axios.get<User[]>('/api/users');
    return data;
  });
};
