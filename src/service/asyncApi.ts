import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../api"
import type { StateSchema } from "../redux/store"
import type { Task, AllTasks, FilterTasksTypes } from "../types/types"

export const fetchAllTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
    'tasks/fetchAllTasks',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as StateSchema
            const auth = state.todo.auth
            if (auth) {
                const response = await api.get('/tasks')
                return response.data
            }
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const createTask = createAsyncThunk<Task, string, { rejectValue: string }>(
    'tasks/createTask',
    async (task, thunkAPI) => {
        try {
            const response = await api.post('/tasks', {
                task,
                done: false,
            })
            return response.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const deleteTask = createAsyncThunk<Task, string, { rejectValue: string }>(
    'tasks/deleteTask',
    async (_id, thunkAPI) => {
        try {
            const response = await api.delete(`/tasks/${_id}`)
            return response.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const doTask = createAsyncThunk<
    { updatedTask: Task; tasks: Task[] },
    { _id: string; done: boolean; },
    { rejectValue: string }
>(
    'tasks/doTask',
    async ({ _id, done }, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as StateSchema
            const filter = state.todo.filter
            const [updateRes, tasksRes] = await Promise.all([
                api.patch(`/tasks/${_id}`, { done }),
                api.get(`/tasks?filter=${filter}`)
            ])

            return {
                updatedTask: updateRes.data,
                tasks: tasksRes.data
            }
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    }
)

export const findTask = createAsyncThunk<Task[], { userId: string, task: string, filter: FilterTasksTypes }, { rejectValue: string }>(
    'tasks/findTask',
    async (taskParams, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as StateSchema
            const response = await api.post('/find', {
                userId: taskParams.userId,
                findTask: taskParams.task,
                filter: state.todo.filter
            })
            return response.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const setFilterTasks = createAsyncThunk<Task[], FilterTasksTypes, { rejectValue: string }>(
    'tasks/setFilterTasks',
    async (filter, thunkAPI) => {
        try {
            const response = await api.get(`/tasks?filter=${filter}`)
            return response.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const setPrivateTask = createAsyncThunk<Task, { _id: string, isPrivate: boolean }, { rejectValue: string }>(
    'tasks/setPrivateTask ',
    async ({ _id, isPrivate }, thunkAPI) => {
        try {
            const response = await api.patch(`/tasks/private/${_id}`, { isPrivate })
            return response.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const logout = createAsyncThunk<null, void, { rejectValue: string }>(
    'tasks/logout',
    async (_, thunkAPI) => {
        try {
            await api.post('/logout')
            localStorage.removeItem('token')
            return null
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)
export const getAllTasks = createAsyncThunk<AllTasks[], void, { rejectValue: string }>(
    'tasks/getAllTasks',
    async (_, thunkAPI) => {
        try {
            const respons = await api.get('/alltasks')
            return respons.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)

export const getAllTasksAdmin = createAsyncThunk<AllTasks[], void, { rejectValue: string }>(
    'tasks/getAllTasksAdmin',
    async (_, thunkAPI) => {
        try {
            const respons = await api.get('/alltasks/admin')
            return respons.data
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue('request error')
        }
    },
)