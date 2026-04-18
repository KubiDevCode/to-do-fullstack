import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { StateSchema } from "./store"
import { api } from "../api"

export type FilterTasksTypes = "all" | "completed" | "notCompleted"

interface Task {
    task: string
    done: boolean
    isPrivate: boolean,
    _id: string
}

export interface User {
    id: string;
    name: string;
    role: "USER" | "ADMIN"
}

export interface TodoStateSchema {
    tasks: Task[]
    allTasks: AllTasks[]
    filter: FilterTasksTypes
    auth: User
}

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

interface AllTasks {
    user: {
        id: string,
        username: string
    }
    tasks: Task[]
}

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
    { _id: string; done: boolean; filter: FilterTasksTypes },
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