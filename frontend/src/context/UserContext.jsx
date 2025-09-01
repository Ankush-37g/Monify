import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import axios from "axios"


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

    const getIncomeData = async() => {
        
          try {
            const response = await axios.post(backendUrl + '/api/income/list',{},{ withCredentials: true });

            console.log(response.data);

            if(response.data.success)
            {
                setIncomes(response.data.data)
            }
          } catch (error) {
            
              if(error.response.data)
              {
                 toast.error(error.response.data.message)
                 console.log(error.response.data)
              }
              else
              {
                 console.log(error.message)
                 toast.error(error.message)
              }
          }
    }


    useEffect( ()=> {
         getIncomeData()
    },[])

    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider

