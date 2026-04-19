import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, StateSchema } from "./store"
import {
    fetchAllTasks,
    createTask,
    doTask,
    deleteTask,
    setFilterTasks,
    logout,
    findTask,
    setPrivateTask,
    getAllTasks,
    getAllTasksAdmin
} from "../service/asyncApi"
import type { TodoStateSchema, FilterTasksTypes, User, Task } from "../types/types"
import { useDispatch } from "react-redux"




const initialState: TodoStateSchema = {
    tasks: [],
    allTasks: [],
    filter: 'all',
    auth: {
        id: '',
        name: '',
        role: "USER"
    },
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<FilterTasksTypes>) => {
            state.filter = action.payload
        },
        auth: (state, action: PayloadAction<User>) => {
            state.auth = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.tasks = action.payload
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                if (state.filter === 'completed' && action.payload.done === false) {
                    return
                }
                state.tasks.push(action.payload)
            })
            .addCase(doTask.fulfilled, (state, action) => {
                state.tasks = action.payload.tasks
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload._id)
            })
            .addCase(setFilterTasks.fulfilled, (state, action) => {
                state.tasks = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.auth = {
                    id: '',
                    name: '',
                    role: "USER"
                };
                state.tasks = []
                state.allTasks = []
            })
            .addCase(findTask.fulfilled, (state, action) => {
                state.tasks = action.payload
            })
            .addCase(setPrivateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((task) =>
                    task._id === action.payload._id ? action.payload : task
                )
            })
            .addCase(getAllTasks.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
            .addCase(getAllTasksAdmin.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
    },
})

export const { actions: todoActions } = todoSlice
export const { reducer: todoReducer } = todoSlice

export const tasksSelector = (state: StateSchema) => state.todo.tasks
export const filterSelector = (state: StateSchema) => state.todo.filter
export const userSelector = (state: StateSchema) => state.todo.auth
export const taskDoneSelector = (id: string) => (state: StateSchema) => {
    const task = state.todo.tasks.find((task) => task._id === id)
    return task?.done ?? false;
}

export const allTasksSelector = (state: StateSchema) => state.todo.allTasks
export const useAppDispatch = () => useDispatch<AppDispatch>()

export { setFilterTasks }
