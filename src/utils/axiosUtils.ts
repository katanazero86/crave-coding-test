import axios from 'axios';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const BASE_URL: string = 'https://randomuser.me/api/' || '';
const api: AxiosInstance = axios.create({baseURL: BASE_URL});

api.interceptors.request.use(
    (config): AxiosRequestConfig => {
        return config;
    },
    (error): Promise<any> => {
        console.error('request error');
        console.error(error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response): AxiosResponse => {
        return response;
    },
    (error): Promise<any> => {
        console.error('response error');
        console.error(error);
        return Promise.reject(error);
    }
);

export {api, axios};
