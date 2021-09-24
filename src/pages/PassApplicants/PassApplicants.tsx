import React, { useEffect } from 'react';
import classes from './PassApplicants.module.scss';
import { useAtom } from 'jotai';
import { totalPassUsersAtom } from '../../store/atoms';
import User from '../../components/User/User';
import { useHistory } from 'react-router';

export default function PassApplicants(): React.ReactElement {
  const [totalPassUsers, setTotalPassUsers] = useAtom(totalPassUsersAtom);
  const history = useHistory();

  useEffect(() => {
    if (totalPassUsers.length === 0 || totalPassUsers.length < 12) {
      history.replace('/');
    }
    return () => {
      setTotalPassUsers([]);
    };
  }, []);

  return (
    <div className={classes.passApplication}>
      <p className={classes.passApplicationMessage}>{totalPassUsers.length}명의 지원자가 1차 통과 했습니다.</p>
      {totalPassUsers.map((user) => {
        return (
          <React.Fragment key={user.login.uuid}>
            <User targetUser={user} isPass={true} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
