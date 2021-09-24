import React from 'react';
import { UsersInterface } from '../../../types/usersTypes';
import classes from '../../../App.module.scss';

interface UserProps {
  targetUser: UsersInterface;
  isPass?: boolean;
  handlePassClick?(targetUser: UsersInterface): void;
  handleUnPassClick?(targetUser: UsersInterface): void;
}

export default function User({
  targetUser,
  isPass = false,
  handlePassClick = () => {},
  handleUnPassClick = () => {},
}: UserProps): React.ReactElement {
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
}
