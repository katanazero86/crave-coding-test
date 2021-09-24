import React, {useEffect, useState} from 'react'
import classes from './App.module.scss'
import apis from './apis/index';
import {UsersInterface} from "./types/usersTypes";

const SEED = 'TEST';
const TOTAL = 100; // 100개 의 랜덤유저가 있다고 과정


interface UserProps {
    targetUser: UsersInterface;
}

const User = ({targetUser}: UserProps): React.ReactElement => {
    return (
        <section className={classes.appUser}>
            <img src={targetUser.picture.thumbnail} alt='user image' width="48" height="48"/>
            <div className={classes.userInfo}>
                <p>
                    {targetUser.name.last} {targetUser.name.first}
                </p>
                <p>
                    {targetUser.cell}
                </p>
                <p>
                    {targetUser.email}
                </p>
            </div>
            <button className={classes.passButton}>
                PASS
            </button>
        </section>
    )
};

export default function App(): React.ReactElement {
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState<UsersInterface[] | []>([]);

    const findUsers = async (): Promise<void> => {
        const result = await apis.userRepository.findUsers(page, SEED, TOTAL);
        if (result.status === 200) {
            const targetUsers: UsersInterface[] | [] = [...result.data.results];
            setUsers(targetUsers);
        } else {
            console.error('api error => userRepository.findUsers');
            console.error(result);
        }
    };

    useEffect(() => {
        findUsers();
    }, []);

    return (
        <div className={classes.app}>
            {
                users.map(user => {
                    return (
                        <>
                            <User targetUser={user}/>
                        </>
                    )
                })
            }
        </div>
    )
}
