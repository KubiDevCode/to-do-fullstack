import { AuthForm } from '../../components/AuthForm/AuthForm';
import s from './AuthPage.module.scss';


export const AuthPage = () => {

    return (
        <div className={s.wrapper}>
            <div className={s.block}>
                <p className={s.title}>Войти</p>
                <AuthForm type='login' />
            </div>

            <div className={s.block}>
                <p className={s.title}>Зарегистрироваться</p>
                <AuthForm type='registrtation' />
            </div>
        </div>
    );
};