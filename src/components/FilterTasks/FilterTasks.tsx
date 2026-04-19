import { useSelector } from 'react-redux';
import s from './FilterTasks.module.scss';
import { filterSelector, setFilterTasks, todoActions, useAppDispatch, } from '../../redux/todoSlice';
import type { FilterTasksTypes } from '../../types/types';

interface FilterTasksProps {
    className?: string;
}



export const FilterTasks = ({ className }: FilterTasksProps) => {
    const dispatch = useAppDispatch()
    const filter = useSelector(filterSelector)

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filter = e.target.value as FilterTasksTypes
        dispatch(todoActions.setFilter(filter))
        dispatch(setFilterTasks(filter))
    }

    return (
        <div className={`${s.wrapper} ${className || ''}`}>
            <label className={s.label}>Сортировать:</label>
            <select
                className={s.select}
                value={filter}
                onChange={onChange}
            >
                <option value="all">Все</option>
                <option value="completed">Выполненные</option>
                <option value="notCompleted">Невыполненные</option>
            </select>
        </div>
    );
};