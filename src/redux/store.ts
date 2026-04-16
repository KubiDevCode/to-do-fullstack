import { configureStore } from '@reduxjs/toolkit'
import { todoReducer, type FilterSchema, type TodoStateSchema } from './todoSlice'

export const store = configureStore({
    reducer: {
        todo: todoReducer
    },
})

export interface StateSchema {
    todo: TodoStateSchema
    filter: FilterSchema
}

