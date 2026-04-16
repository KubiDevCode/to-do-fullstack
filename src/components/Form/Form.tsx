import { useState } from 'react';
import s from './Form.module.scss';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/todoSlice';

export const Form = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return;
        }

        dispatch(createTask(trimmedValue));
        setValue('');
    };

    return (
        <form className={s.form} onSubmit={onSubmit}>
            <input
                className={s.input}
                value={value}
                onChange={onChange}
                placeholder="Введите новую задачу..."
            />
            <button className={s.button} type='submit'>
                Добавить
            </button>
        </form>
    );
};