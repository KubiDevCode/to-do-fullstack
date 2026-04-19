import { configureStore } from '@reduxjs/toolkit'
import type { TodoStateSchema } from '../types/types'
import { todoReducer } from './todoSlice'


export const store = configureStore({
    reducer: {
        todo: todoReducer
    },
})

export interface StateSchema {
    todo: TodoStateSchema
}
export type AppDispatch = typeof store.dispatch
