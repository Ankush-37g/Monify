import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    
     
    const [token,setToken] = useState('')

    const navigate = useNavigate()

    const [balance, setBalance] = useState(null)

    const [income, setIncome] = useState(null)

    const [expense , setExpense] = useState(null)

    const value = {navigate,token,balance,income, expense}

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

export default UserContextProvider

