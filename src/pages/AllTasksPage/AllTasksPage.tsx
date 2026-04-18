import { useDispatch, useSelector } from 'react-redux';
import s from './AllTasksPage.module.scss';
import { useEffect } from 'react';
import {
    allTasksSelector,
    getAllTasks,
    getAllTasksAdmin,
    setPrivateTask,
    doTask,
    userSelector,
} from '../../redux/todoSlice';
import { useAuth } from '../../hooks/useAuth';
import type { AppDispatch } from '../../redux/store';

interface PublicTask {
    _id: string;
    task: string;
    done: boolean;
    isPrivate: boolean;
}

interface UserTasks {
    user: {
        id: string;
        name: string;
    };
    tasks: PublicTask[];
}

interface AllTasksPageProps {
    className?: string;
}

export const AllTasksPage = ({ className }: AllTasksPageProps) => {
    useAuth();

    const dispatch = useDispatch<AppDispatch>();
    const allTasks = useSelector(allTasksSelector) as UserTasks[];
    const user = useSelector(userSelector);
    const userRole = user.role;

    useEffect(() => {
        if (!userRole) return;

        if (userRole === 'ADMIN') {
            dispatch(getAllTasksAdmin());
            return;
        }

        dispatch(getAllTasks());
    }, [dispatch, userRole]);

    const refetchAllTasks = async () => {
        if (userRole === 'ADMIN') {
            await dispatch(getAllTasksAdmin()).unwrap();
            return;
        }

        await dispatch(getAllTasks()).unwrap();
    };

    const onToggleDone = async (_id: string, done: boolean) => {
        try {
            await dispatch(doTask({ _id, done: !done })).unwrap();
            await refetchAllTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const onTogglePrivate = async (_id: string, isPrivate: boolean) => {
        try {
            await dispatch(setPrivateTask({ _id, isPrivate: !isPrivate })).unwrap();
            await refetchAllTasks();
        } catch (error) {
            console.log(error);
        }
    };

    if (allTasks.length === 0) {
        return (
            <section className={`${s.page} ${className || ''}`}>
                <div className={s.container}>
                    <div className={s.wrapper}>
                        <h1 className={s.title}>Все задачи</h1>
                        <p className={s.emptyText}>Пока нет задач</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${s.page} ${className || ''}`}>
            <div className={s.container}>
                <div className={s.wrapper}>
                    <h1 className={s.title}>
                        {userRole === 'ADMIN' ? 'Все задачи (admin)' : 'Все публичные задачи'}
                    </h1>

                    <div className={s.usersList}>
                        {allTasks.map((item) =>
                            item.tasks.length ? (
                                <div key={item.user.id} className={s.userBlock}>
                                    <h2 className={s.userName}>{item.user.name}</h2>

                                    <div className={s.tasksList}>
                                        {item.tasks.map((task) => (
                                            <div key={task._id} className={s.taskItem}>
                                                <div className={s.taskInfo}>
                                                    <span
                                                        className={
                                                            task.done ? s.statusDone : s.statusActive
                                                        }
                                                    >
                                                        {task.done ? 'Выполнено' : 'Активно'}
                                                    </span>

                                                    {userRole === 'ADMIN' && (
                                                        <span
                                                            className={
                                                                task.isPrivate
                                                                    ? s.privateBadge
                                                                    : s.publicBadge
                                                            }
                                                        >
                                                            {task.isPrivate ? 'Приватная' : 'Публичная'}
                                                        </span>
                                                    )}

                                                    <p className={s.taskText}>{task.task}</p>
                                                </div>

                                                {userRole === 'ADMIN' && (
                                                    <div className={s.actions}>
                                                        <button
                                                            type="button"
                                                            className={s.actionButton}
                                                            onClick={() =>
                                                                onToggleDone(task._id, task.done)
                                                            }
                                                        >
                                                            {task.done
                                                                ? 'Сделать активной'
                                                                : 'Сделать выполненной'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={s.actionButton}
                                                            onClick={() =>
                                                                onTogglePrivate(
                                                                    task._id,
                                                                    task.isPrivate
                                                                )
                                                            }
                                                        >
                                                            {task.isPrivate
                                                                ? 'Сделать публичной'
                                                                : 'Сделать приватной'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};