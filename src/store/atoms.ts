import { atom } from 'jotai';
import { UsersInterface } from '../types/usersTypes';

export const totalPassUsersAtom = atom<UsersInterface[] | []>([]);
