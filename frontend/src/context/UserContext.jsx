import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
     
    const [token,setToken] = useState('')

    const navigate = useNavigate()

    const value = {token,backendUrl,navigate}

    useEffect( ()=> {

        const storedToken = localStorage.getItem('token');

        if(!token && storedToken)
        {
            setToken(storedToken);
        }

    },[token])

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    )
}

