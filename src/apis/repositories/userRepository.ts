import { AxiosInstance } from 'axios';

interface UserRepositoryInterface {
  findUsers(page: number, seed: string, result: number): Promise<any>;
}

export default (api: AxiosInstance): UserRepositoryInterface => {
  return {
    async findUsers(page: number, seed: string, result: number): Promise<any> {
      return api.get(`/?page=${page}&results=${result}&seed=${seed}`);
    },
  };
};
