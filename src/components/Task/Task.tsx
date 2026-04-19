import { useAppDispatch } from '../../redux/todoSlice';
import { setPrivateTask, doTask, deleteTask } from '../../service/asyncApi';
import s from './Task.module.scss';


interface TaskProps {
    className?: string;
    task: string;
    done: boolean;
    isPrivate: boolean
    _id: string;
}

export const Task = (props: TaskProps) => {
    const {
        className,
        task,
        done,
        isPrivate,
        _id,
    } = props;

    // const [isVisible, setIsVisible] = useState(false)
    const dispatch = useAppDispatch()


    const onVisibleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        dispatch(setPrivateTask({ _id, isPrivate: !isPrivate }))
    }

    const onChange = () => {
        dispatch(doTask({ _id, done: !done }));
    };

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        dispatch(deleteTask(_id));
    };

    return (
        <div onClick={onRightClick} className={`${s.task} ${className || ''}`}>
            <div className={s.left}>
                <button
                    type="button"
                    className={s.eyeButton}
                    onClick={onVisibleClick}
                >
                    {isPrivate ? (
                        <svg
                            className={s.eyeIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.77 21.77 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.86 21.86 0 0 1-2.16 3.19" />
                            <path d="M1 1l22 22" />
                            <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                        </svg>
                    ) : (
                        <svg
                            className={s.eyeIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>

                <p className={done ? s.taskDone : ''}>{task}</p>
            </div>

            <input
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                type="checkbox"
                onChange={onChange}
                checked={done}
            />
        </div>
    );
};