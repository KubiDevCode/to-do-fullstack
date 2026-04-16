import { useState } from 'react';
import s from './AuthForm.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
    type: 'login' | 'registrtation'
}

export const AuthForm = (props: AuthFormProps) => {
    const {
        type
    } = props

    const [loginValue, setLoginValue] = useState('');
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('');
    const navigate = useNavigate()

    const onSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await axios.post('/todo/login', {
            username: loginValue,
            password: passwordValue,
        })
        navigate('/')
        console.log(response)
    };



    const onSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await axios.post('/todo/registration', {
            username: loginValue,
            email: emailValue,
            password: passwordValue,
        })

        if (response.status === 200) {
            navigate('/')
        }
    };

    const formEntity = (
        <>
            <input
                className={s.input}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Логин"
            />

            {type === 'registrtation' ? <input
                className={s.input}
                type='email'
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="email"
            /> : null}

            <input
                className={s.input}
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Пароль"
            />

            <button className={s.button} type="submit">
                Отправить
            </button>
        </>
    )

    if (type === 'login') {
        return (
            <form onSubmit={onSubmitLogin} className={s.form}>
                {formEntity}
            </form>
        );
    }

    if (type === 'registrtation') {
        return (
            <form onSubmit={onSubmitRegistration} className={s.form}>
                {formEntity}
            </form>
        );
    }
};