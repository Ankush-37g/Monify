import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
   
    const [token,setToken] = useState('')

    const navigate = useNavigate()

    const [balance, setBalance] = useState(null)

    const [incomes, setIncomes] = useState([])

    const [expenses , setExpenses] = useState([])

    const [visible, setVisible] = useState(false)

    const value = {navigate,token,balance,incomes, expenses,visible,setVisible,backendUrl}

    const getIncomeData = () => {
        
         
    }

    useEffect( ()=> {

    

    },[])

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider

