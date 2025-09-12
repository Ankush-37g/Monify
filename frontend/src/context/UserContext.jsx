import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import api from "../utils/Api.js";

export const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const navigate = useNavigate()
    
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(null)

    const [totalIncome, setTotalIncome] = useState(null)
 
    const [totalExpense, setTotalExpense] = useState(null)

    const [incomes, setIncomes] = useState([])

    const [expenses , setExpenses] = useState([])

     const [budgets, setBudgets] = useState([]);

    const [visible, setVisible] = useState(false)

    const [user, setUser] = useState("")
    
    const [avatarUrl, setAvatarUrl] = useState(() => {

        const storedUrl = localStorage.getItem("avatarUrl");
        if (storedUrl) return storedUrl;
        
        const randomNum = Math.floor(Math.random() * 50) + 1;
        const newUrl = `https://avatar.iran.liara.run/public/${randomNum}`;
        localStorage.setItem("avatarUrl", newUrl);
        return newUrl;
    })

    const checkBudgetLimits = (newExpense) => {
        budgets.forEach(budget => {
            if (budget.category === newExpense.expenseCategory) {
                const categoryExpenses = expenses
                    .filter(e => e.expenseCategory === budget.category)
                    .reduce((sum, e) => sum + e.amount, 0);
                
                const newTotal = categoryExpenses + newExpense.amount;
                const percentage = (newTotal / budget.amount) * 100;

                if (percentage >= 100) {
                    toast.error(`Budget exceeded for ${budget.category}! You've spent ${percentage.toFixed(1)}% of your budget.`);
                } else if (percentage >= 80) {
                    toast.warning(`Warning: You've used ${percentage.toFixed(1)}% of your ${budget.category} budget.`);
                } else if (percentage >= 50) {
                    toast.info(`Note: You've used ${percentage.toFixed(1)}% of your ${budget.category} budget.`);
                }
            }
        });
    }

    const value = {
        navigate,
        balance,
        incomes,
        setIncomes, 
        expenses,
        setExpenses,
        visible,
        setVisible,
        user,
        setUser,
        totalIncome,
        totalExpense,
        budgets,
        setBudgets,
        avatarUrl,
        setAvatarUrl,
        checkBudgetLimits,
        isLoading,
        setIsLoading
    }

    const getTotalIncome = () => {
          
        const netIncome = incomes.reduce((acc,income)=> acc + income.amount,0)

        setTotalIncome(netIncome)
    }

    const getTotalExpense = () => {
          
        const netExpense = expenses.reduce((acc,expense)=> acc + expense.amount,0)
        
        setTotalExpense(netExpense)
    }

    const getIncomeData = async() => {
        
          try {
            const response = await api.post('/income/list',{});

            // console.log(response.data);

            if(response.data.success)
            {
                const sortedIncomes = [...response.data.data].sort(
                        (a,b) => new Date(a.date) - new Date(b.date)
                )
                setIncomes(sortedIncomes)
            }
          } catch (error) {
            
              if(error.response)
              {
                 toast.error(error.response.data.message)
                 console.log(error.response.data)
              }
              else
              {
                 toast.error(error.message)
                 console.log(error.message)  
              }
          }
    }

    const getExpenseData = async() => {
        
          try {
            const response = await api.post('/expense/list',{});

            // console.log(response.data);

            if(response.data.success)
            {
                 const sortedExpenses = [...response.data.data].sort(
                       (a, b) => new Date(a.date) - new Date(b.date)
                );
                setExpenses(sortedExpenses)
            }
          } catch (error) {
            
              if(error.response)
              {
                 toast.error(error.response.data.message)
                 console.log(error.response.data)
              }
              else
              {
                 toast.error(error.message)
                 console.log(error.message)  
              }
          }
    }

    const getBudgetData = async() => {
        
          try {
            const response = await api.post('/budget/list',{});

            // console.log(response.data);

            if(response.data.success)
            {  
                setBudgets(response.data.data)
            }
          } catch (error) {
            
              if(error.response)
              {
                 toast.error(error.response.data.message)
                 console.log(error.response.data)
              }
              else
              {
                 toast.error(error.message)
                 console.log(error.message)  
              }
          }
    }

    const checkLogin = async () => {
        setIsLoading(true);
        try {
        const res = await api.get("/user/me"); 
        if (res.data?.success) {
            setUser(res.data.data); 
            localStorage.setItem("user", JSON.stringify(res.data.data));
        }
        } catch (err) {
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

        
    useEffect( ()=> {
    
        if(user)
        {
            getIncomeData()

            getExpenseData()

            getBudgetData() 
        }
    },[user])

    useEffect(() => {
        getTotalIncome();
        getTotalExpense();

    }, [incomes, expenses]);

   
    useEffect(() => {

        if (totalIncome !== null && totalExpense !== null) 
        {
            setBalance(totalIncome - totalExpense);
        }

    }, [totalIncome, totalExpense]);



    return (
        <UserContext.Provider value = {value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider

