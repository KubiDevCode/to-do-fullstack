import { useEffect, useState } from "react"
import { todoActions, useAppDispatch} from "../redux/todoSlice"
import { api } from "../api"
import type { User } from "../types/types"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/refresh')
        localStorage.setItem('token', response.data.accessToken)

        const authUser: User = {
          id: response.data.user.id,
          name: response.data.user.username,
          role: response.data.user.role,
        }

        dispatch(todoActions.auth(authUser))
        setUser(authUser)
      } catch (error) {
        localStorage.removeItem('token')
        console.log(error)
      }
    }

    checkAuth()
  }, [dispatch])

  return user?.name
}