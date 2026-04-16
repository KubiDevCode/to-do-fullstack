import { useDispatch, useSelector } from 'react-redux';
import s from './AllTasksPage.module.scss';
import { useEffect } from 'react';
import { allTasksSelector, getAllTasks, getAllTasksAdmin, todoActions, userSelector } from '../../redux/todoSlice';
import { Task } from '../../components/Task/Task';
import { useAuth } from '../../hooks/useAuth';

interface PublicTask {
    _id: string;
    task: string;
    done: boolean;
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
    const dispatch = useDispatch()
    const allTasks = useSelector(allTasksSelector)
    const user = useSelector(userSelector)
    const userRole = user.role

    useEffect(() => {
        const fetchData = () => {
            if (userRole === 'USER') {
                dispatch(getAllTasks())
            }
            if (userRole === 'ADMIN') {
                dispatch(getAllTasksAdmin())
            }
            console.log(userRole)
        }

        fetchData()

        const interval = setInterval(() => {
            fetchData()
        }, 5000)

        return () => clearInterval(interval)
    }, [dispatch, userRole])

    if (allTasks.length === 0) {
        return (
            <h1>ЗАРЕГАЙСЯ ДОЛБОЕБ</h1>
        )
    }

    return (
        <section className={`${s.page} ${className || ''}`}>
            <div className={s.container}>
                <div className={s.wrapper}>
                    <h1 className={s.title}>Все публичные задачи</h1>

                    <div className={s.usersList}>
                        {allTasks.map((item) => (
                            item.tasks.length ? <div key={item.user.id} className={s.userBlock}>
                                <h2 className={s.userName}>{item.user.name}</h2>

                                {userRole === "ADMIN"
                                    ?
                                    <div className={s.tasksList}>
                                        {item.tasks.map((task) =>
                                            <Task
                                                _id={task._id}
                                                done={task.done}
                                                isPrivate={task.isPrivate}
                                                task={task.task}
                                            />
                                        )}
                                    </div>
                                    :
                                    <div className={s.tasksList}>
                                        {item.tasks.map((task) => (
                                            <div key={task._id} className={s.taskItem}>
                                                <span
                                                    className={
                                                        task.done ? s.statusDone : s.statusActive
                                                    }
                                                >
                                                    {task.done ? 'Выполнено' : 'Активно'}
                                                </span>

                                                <p className={s.taskText}>{task.task}</p>
                                            </div>
                                        ))}
                                    </div>}
                            </div> : null
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};