import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { todoActions, type User } from "../redux/todoSlice"
import { api } from "../api"

export const useAuth = () => {
    const dispatch = useDispatch()
    const [user, setUser] = useState<User>()
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/refresh')

                localStorage.setItem("token", response.data.accessToken)

                dispatch(todoActions.auth(
                    {
                        name: response.data.user.username,
                        id: response.data.user.id,
                        role: response.data.user.role
                    }
                ))
                setUser({
                    name: response.data.user.username,
                    id: response.data.user.id,
                    role: response.data.user.role
                })

            } catch (error) {
                localStorage.removeItem("token");
                console.log(error);
            }
        }
        checkAuth()
    }, [dispatch])
    
    if (user?.name) {
        return user
    }

}