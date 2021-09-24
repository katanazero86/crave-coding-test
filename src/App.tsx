import React, { useCallback, useEffect, useState } from 'react';
import classes from './App.module.scss';
import apis from './apis/index';
import { UsersInterface } from './types/usersTypes';
import Pagination from './components/Pagination/Pagination';
import User from './components/App/User/User';
import UserSearch from './components/App/UserSearch/UserSearch';

const SEED = 'TEST';
const TOTAL = 100; // 100개 의 랜덤유저가 있다고 과정
const SIZE = 10;

export default function App(): React.ReactElement {
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<UsersInterface[] | []>([]);
  const [totalUsers, setTotalUsers] = useState<UsersInterface[] | []>([]);
  const [hiddenUsers, setHiddenUsers] = useState<UsersInterface[] | []>([]);

  const [passPage, setPassPage] = useState<number>(1);
  const [passUsers, setPassUsers] = useState<UsersInterface[] | []>([]);
  const [totalPassUsers, setTotalPassUsers] = useState<UsersInterface[] | []>([]);

  const sortHelper = (a: any, b: any) => {
    if (a.name.first > b.name.first) {
      return 1;
    }

    if (a.name.first < b.name.first) {
      return -1;
    }

    return 0;
  };

  const findUsers = async (): Promise<void> => {
    const result = await apis.userRepository.findUsers(1, SEED, TOTAL);
    if (result.status === 200) {
      result.data.results.sort(sortHelper);
      const targetUsers: UsersInterface[] | [] = result.data.results.slice((page - 1) * SIZE, page * SIZE);
      setUsers(targetUsers);
      setTotalUsers([...result.data.results]);
    } else {
      console.error('api error => userRepository.findUsers');
      console.error(result);
    }
  };

  const handlePassClick = (targetUser: UsersInterface): void => {
    if (totalPassUsers.length < 12) {
      const resultUser = totalPassUsers.find((user) => user.login.uuid === targetUser.login.uuid);
      if (resultUser === undefined) {
        const resultTotalUsers = totalUsers.filter((user) => user.login.uuid !== targetUser.login.uuid);
        const targetUsers: UsersInterface[] | [] = resultTotalUsers.slice((page - 1) * SIZE, page * SIZE);
        setUsers(targetUsers);
        setTotalUsers(resultTotalUsers);
        setTotalPassUsers([...totalPassUsers, targetUser]);
      }
    } else {
      alert('12명을 넘길수 없습니다!');
      return;
    }
  };

  const handelPageClick = useCallback(
    (targetPage: number): void => {
      const targetUsers: UsersInterface[] | [] = totalUsers.slice((targetPage - 1) * SIZE, targetPage * SIZE);
      setUsers(targetUsers);
      setPage(targetPage);
    },
    [totalUsers],
  );

  const handleUnPassClick = (targetUser: UsersInterface): void => {
    const resultUsers = totalPassUsers.filter((user) => user.login.uuid !== targetUser.login.uuid);
    const resultTotalUsers = [...totalUsers, targetUser].sort(sortHelper);
    const targetUsers: UsersInterface[] | [] = resultTotalUsers.slice((page - 1) * SIZE, page * SIZE);
    setUsers(targetUsers);
    setTotalUsers(resultTotalUsers);
    setTotalPassUsers([...resultUsers]);
  };

  const handlePassPageClick = (targetPage: number): void => {
    const targetPassUsers: UsersInterface[] | [] = totalPassUsers.slice((targetPage - 1) * SIZE, targetPage * SIZE);
    setPassUsers(targetPassUsers);
    setPassPage(targetPage);
  };

  const handleSearchClick = (targetText: string): void => {
    const realTotal = hiddenUsers.length === 0 ? [...totalUsers] : [...hiddenUsers, ...totalUsers].sort(sortHelper);
    if (targetText === '') {
      const targetUsers: UsersInterface[] | [] = realTotal.slice((1 - 1) * SIZE, 10);
      setUsers(targetUsers);
      setHiddenUsers([]);
      setTotalUsers(realTotal);
      setPage(1);
    } else {
      const hiddenResult: UsersInterface[] = [];
      const result = realTotal
        .filter((user) => {
          if (user.email.includes(targetText)) return true;
          if (user.name.first.includes(targetText) || user.name.last.includes(targetText)) return true;
          hiddenResult.push(user);
          return false;
        })
        .sort(sortHelper);

      const targetUsers: UsersInterface[] | [] = result.slice((1 - 1) * SIZE, 10);
      setUsers(targetUsers);
      setPage(1);
      setHiddenUsers(hiddenResult);
      setTotalUsers(result);
    }
  };

  useEffect(() => {
    findUsers();
  }, []);

  useEffect(() => {
    if (totalPassUsers.length > SIZE) {
      const targetPassUsers: UsersInterface[] | [] = totalPassUsers.slice((passPage - 1) * SIZE, passPage * SIZE);
      setPassUsers(targetPassUsers);
    } else {
      setPassUsers([...totalPassUsers]);
    }
  }, [totalPassUsers]);

  return (
    <div className={classes.app}>
      <UserSearch handleSearchClick={handleSearchClick} />
      <div className={classes.appWrap}>
        <div className={classes.left}>
          {users.map((user) => {
            return (
              <React.Fragment key={user.login.uuid}>
                <User targetUser={user} handlePassClick={handlePassClick} />
              </React.Fragment>
            );
          })}
          <Pagination total={totalUsers.length} page={page} size={SIZE} handelPageClick={handelPageClick} />
        </div>
        <div className={classes.right}>
          {passUsers.map((user) => {
            return (
              <React.Fragment key={user.login.uuid}>
                <User targetUser={user} handleUnPassClick={handleUnPassClick} isPass={true} />
              </React.Fragment>
            );
          })}
          <Pagination total={totalPassUsers.length} page={passPage} size={SIZE} handelPageClick={handlePassPageClick} />
        </div>
      </div>
    </div>
  );
}
