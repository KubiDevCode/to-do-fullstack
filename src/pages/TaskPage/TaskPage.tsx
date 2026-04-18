import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FilterTasks } from '../../components/FilterTasks/FilterTasks';
import { Task } from '../../components/Task/Task';
import { tasksSelector, fetchAllTasks, logout, userSelector, findTask, setFilterTasks, filterSelector } from '../../redux/todoSlice';
import s from './TaskPage.module.scss';
import { Form } from '../../components/Form/Form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface TaskPageProps {
    className?: string;
}

export const TaskPage = ({ className }: TaskPageProps) => {
    const [searchValue, setSearchValue] = useState('')
    const dispatch = useDispatch();
    const tasks = useSelector(tasksSelector);
    const navigate = useNavigate();
    const filter = useSelector(filterSelector)
    const user = useSelector(userSelector);
    useAuth();

    useEffect(() => {
        if (user.name) {
            dispatch(fetchAllTasks());
        }
    }, [dispatch, user]);

    const onReload = () => {
        if (user.name) {
            dispatch(fetchAllTasks());
        }
    };

    const onAllTasks =()=>{
        navigate('/tasks')
    }

    const onLogout = () => {
        dispatch(logout());
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    };

    const onClearSearch = () => {
        setSearchValue('')
        dispatch(setFilterTasks(filter))
    }

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { id } = user
        dispatch(findTask({ userId: id, task: searchValue }))
    }

    if (!user.name) {
        return (
            <section className={`${s.page} ${className || ''}`}>
                <div className={s.container}>
                    <div className={s.authCard}>
                        <div className={s.authContent}>
                            <span className={s.authBadge}>Доступ ограничен</span>

                            <h1 className={s.authTitle}>Ты не авторизован</h1>

                            <p className={s.authText}>
                                Чтобы просматривать, добавлять и редактировать задачи,
                                войди в свой аккаунт.
                            </p>

                            <button
                                className={s.authButton}
                                onClick={() => navigate('/auth')}
                            >
                                Перейти к авторизации
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${s.page} ${className || ''}`}>
            <div className={s.container}>
                <div className={s.todoCard}>
                    <div className={s.header}>
                        <div className={s.headerInfo}>
                            <span className={s.userBadge}>{user?.name}</span>
                            <h1 className={s.title}>Todo List</h1>
                            <p className={s.subtitle}>
                                Управляй своими задачами быстро и удобно
                            </p>
                        </div>

                        <div className={s.buttonBox}>
                            <button className={s.reloadButton} onClick={onReload}>
                                Обновить
                            </button>
                            <button className={s.exitButton} onClick={onLogout}>
                                Выйти
                            </button>
                            <button className={s.reloadButton} onClick={onAllTasks}>
                                Все задачи
                            </button>
                        </div>
                    </div>

                    <div className={s.toolbar}>
                        <div className={s.filterWrap}>
                            <FilterTasks />
                        </div>

                        <div className={s.counterBox}>
                            <span className={s.counterLabel}>Всего задач</span>
                            <span className={s.counterValue}>{tasks?.length}</span>
                        </div>
                    </div>

                    <div className={s.searchSection}>
                        <form className={s.searchForm} onSubmit={onSearchSubmit}>
                            <div className={s.searchInputWrap}>
                                <input
                                    type="text"
                                    className={s.searchInput}
                                    value={searchValue}
                                    placeholder="Поиск задачи..."
                                    onChange={onSearchChange}
                                />

                                <button
                                    type="button"
                                    onClick={onClearSearch}
                                    className={`${searchValue ? s.clearButton : s.clearButtonDn}`}
                                    aria-label="Очистить поиск"
                                >
                                    ×
                                </button>
                            </div>

                            <button
                                type="submit"
                                className={s.searchButton}
                            >
                                Найти
                            </button>
                        </form>
                    </div>

                    <div className={s.listSection}>
                        {tasks?.length > 0 ? (
                            <div className={s.list}>
                                {tasks.map((task) => (
                                    <Task
                                        key={task._id}
                                        task={task.task}
                                        _id={task._id}
                                        done={task.done}
                                        isPrivate={task.isPrivate}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={s.emptyState}>
                                <h3 className={s.emptyTitle}>Список пуст</h3>
                                <p className={s.emptyText}>
                                    Добавь первую задачу через форму ниже
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={s.formSection}>
                        <Form />
                    </div>
                </div>
            </div>
        </section>
    );
};