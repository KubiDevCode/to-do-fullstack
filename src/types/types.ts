export interface AllTasks {
    user: {
        id: string,
        username: string
    }
    tasks: Task[]
}

export type FilterTasksTypes = "all" | "completed" | "notCompleted"

export interface Task {
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