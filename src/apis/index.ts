import { api, axios } from '../utils/axiosUtils';

// apis
import userRepository from './repositories/userRepository';

export default {
  userRepository: userRepository(api),
};
