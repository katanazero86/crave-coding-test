import React, { useEffect, useState } from 'react';
import classes from './App.module.scss';
import apis from './apis/index';
import { UsersInterface } from './types/usersTypes';
import Pagination from './components/Pagination/Pagination';

const SEED = 'TEST';
const TOTAL = 100; // 100개 의 랜덤유저가 있다고 과정
const SIZE = 10;

interface UserProps {
  targetUser: UsersInterface;
  isPass?: boolean;

  handlePassClick?(targetUser: UsersInterface): void;

  handleUnPassClick?(targetUser: UsersInterface): void;
}

const User = ({
  targetUser,
  isPass = false,
  handlePassClick = () => {},
  handleUnPassClick = () => {},
}: UserProps): React.ReactElement => {
  return (
    <section className={classes.appUser}>
      <img src={targetUser.picture.thumbnail} alt='user image' width='48' height='48' />
      <div className={classes.userInfo}>
        <p>
          {targetUser.name.last} {targetUser.name.first}
        </p>
        <p>{targetUser.cell}</p>
        <p>{targetUser.email}</p>
      </div>
      {isPass ? (
        <button className={classes.passButton} onClick={() => handleUnPassClick(targetUser)}>
          UnPass
        </button>
      ) : (
        <button className={classes.passButton} onClick={() => handlePassClick(targetUser)}>
          PASS
        </button>
      )}
    </section>
  );
};

export default function App(): React.ReactElement {
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<UsersInterface[] | []>([]);
  const [totalUsers, setTotalUsers] = useState<UsersInterface[] | []>([]);
  const [passPage, setPassPage] = useState<number>(1);
  const [passUsers, setPassUsers] = useState<UsersInterface[] | []>([]);
  const [totalPassUsers, setTotalPassUsers] = useState<UsersInterface[] | []>([]);

  const findUsers = async (): Promise<void> => {
    const result = await apis.userRepository.findUsers(1, SEED, TOTAL);
    if (result.status === 200) {
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

  const handelPageClick = (targetPage: number): void => {
    const targetUsers: UsersInterface[] | [] = totalUsers.slice((targetPage - 1) * SIZE, targetPage * SIZE);
    setUsers(targetUsers);
    setPage(targetPage);
  };

  const handleUnPassClick = (targetUser: UsersInterface): void => {
    const resultUsers = totalPassUsers.filter((user) => user.login.uuid !== targetUser.login.uuid);
    const resultTotalUsers = [...totalUsers, targetUser];
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
      <div className={classes.appLeft}>
        {users.map((user) => {
          return (
            <React.Fragment key={user.login.uuid}>
              <User targetUser={user} handlePassClick={handlePassClick} />
            </React.Fragment>
          );
        })}
        <Pagination total={totalUsers.length} page={page} size={SIZE} handelPageClick={handelPageClick} />
      </div>
      <div className={classes.appRight}>
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
  );
}
