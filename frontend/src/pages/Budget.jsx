import { useContext } from 'react';
import { useState } from 'react'
import { IoAdd } from "react-icons/io5";
import { UserContext } from '../context/UserContext';
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from 'react-chartjs-2'
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import api from '../utils/Api.js';

const Budgets = () => {

  const {budgets,setBudgets,expenses} = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)

  const [category,setCategory] = useState("")

  const [amount, setAmount] = useState("")

  const [month, setMonth] = useState("")

  const categories = budgets.map(b => b.category);

  const budgeted = budgets.map(b => b.amount);

  const spent = budgets.map((b)=>{
        return expenses
               .filter(e => e.expenseCategory === b.category)
               .reduce((sum,e)=> sum + e.amount, 0)
  })

  const BudgetData = {

    labels: categories,
    datasets: [
      {
        label: "Budgeted Amount",
        data: budgeted,
        backgroundColor: "rgba(54, 162, 235, 0.7)", // blue
      },
      {
        label: "Spent Amount",
        data: spent,
        backgroundColor: "rgba(255, 99, 132, 0.7)", // red
      }
    ]
  };

  const BudgetOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "white" } // legend text color
      },
      title: {
        display: true,
        // text: "Budget vs. Spent",
        color: "white",
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        ticks: { color: "white" },
       
      },
      y: {
        ticks: { color: "white" },
      
      }
    }
  };

  const onSubmitHandler = async(e) => {

        e.preventDefault()

       try {
         
          const response = await api.post('/budget/add', {category,amount,month});

          console.log(response.data)

          if(response.data.success)
          {
              toast.success(response.data.message)

              setBudgets((prev) => [...prev,response.data.data])
              
          }
       } catch (error) {
        
           if (error.response && error.response.data) {

            toast.error(error.response.data.message || "Something went wrong!");
            console.log(error.response.data);
           } else
           {
            toast.error(error.message || "Network Error");
            console.log(error.message);
           }
       }
      
       
      
  }  

  const handleDeleteBudget = async(id) => {
        
    try {

      const response = await api.post('/budget/delete',{id})

      console.log(response.data)

      if(response.data.success)
      {
         toast.success("Budget deleted successfully")

         setBudgets(prev => prev.filter(budget => budget._id !== id))
      }


    } catch (error) {
         if (error.response && error.response.data) {

            toast.error(error.response.data.message || "Something went wrong!");
            console.log(error.response.data);
         } else
         {
            toast.error(error.message || "Network Error");
            console.log(error.message);
         }
    }
  }
  
  return (
      <div className='flex flex-col gap-4  relative text-gray-200'>
           
          {/* Bar chart for Budgets vs Spent*/}
          <div className='border-0 px-5 pt-5 pb-5 shadow-lg bg-gray-900 rounded-xl w-full flex flex-col'>
                
                <div className="flex justify-between">

                  <div className="flex flex-col gap-0.5 mb-5" >
                      <p className='text-3xl font-semibold '>Budget v/s Spent Overview</p>

                  </div>
                  
                  <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 sm:px-4 px-2 sm:py-2  rounded-xl h-10 bg-gray-200 text-black cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out ">

                      <IoAdd className="w-5 h-5 font-bold"/>
                      <p className="font-bold">Add new Budget</p>

                  </div>

                </div>
                
                <div className="h-80 mb-1">
                    <Bar data = {BudgetData} options={BudgetOptions}/>
                </div>
                        
          </div> 
 
          {/* All budgets */}
          <div className='p-5 shadow-lg bg-gray-900 rounded-xl w-full '>
          
              <div className='flex justify-between items-center'>

                  <p className='text-3xl font-semibold'> My Budgets </p>

    
              </div>

              <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 mt-6 gap-3'>
                     
                     
                    {
                      budgets.map((budget, index) => {

                          const totalSpent = expenses
                                             .filter(e => e.expenseCategory === budget.category)
                                             .reduce((sum,e)=> sum + e.amount, 0)

                          const remaining = budget.amount - totalSpent;

                          const progress = (totalSpent / budget.amount) * 100;

                          let progressBarColor = 'bg-green-500';

                          if (progress >= 100) 
                          {
                            progressBarColor = 'bg-red-500';

                          } else if (progress > 80) 
                          {
                            progressBarColor = 'bg-yellow-500';
                          }

                          return (
                            <div key={index} className="backdrop-blur-sm bg-gray-800/70 p-6 rounded-2xl shadow-lg border border-gray-700">

                              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 group">

                                <div className='flex flex-row items-center gap-3'>
                                     <h3 className="text-xl font-bold text-blue-400">{budget.category}</h3>
                                     <RiDeleteBin6Line onClick={()=>handleDeleteBudget(budget._id)} className="hidden group-hover:block w-4 h-4 cursor-pointer "/>
                                </div>
                                

                                <div className="flex items-center space-x-4 text-sm font-medium">

                                  <span className="text-gray-400">
                                    Budgeted: <span className="text-gray-100">${budget.amount}</span>
                                  </span>

                                  <span className="text-gray-400">
                                    Spent: <span className="text-gray-100">${totalSpent}</span>
                                  </span>

                                  <span className="text-gray-400">
                                    Remaining: <span className="text-gray-100">${Math.max(0, remaining)}</span>
                                  </span>

                                </div>

                              </div>

                    

                              {/* progress bar */}
                              <div className="w-full h-2 bg-gray-700 rounded-full mt-4">
                                <div
                                  className={`progress-bar h-2 rounded-full ${progressBarColor}`}
                                  style={{ width: `${Math.min(100, progress)}%` }}
                                ></div>
                              </div>
                            </div>
                        );
                      })}
                     

                    

              </div>

                
          </div>

          {/* Add Budget */}
          <div className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-transparent bg-opacity-30 backdrop-blur-xs" : "opacity-0 invisible"
                }`}>

            <div
              className={`bg-gray-200 rounded-xl p-5 shadow-lg shadow-gray-700 text-black transform transition-transform duration-300 ${
                isOpen ? "scale-100" : "scale-90"
              }`}
            >
              <div className="flex justify-between items-center mb-3">

                <p className="text-2xl font-semibold ">Add Budget</p>

                <RxCross2
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 cursor-pointer"
                />

              </div>

              <hr className="font-extralight mb-8"/>

              <form onSubmit={onSubmitHandler}>


                 <div className="flex flex-col gap-1 mb-3 ">
                   <p>Category</p>
                   <input
                      type="text"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Food, Travel , Subscriptions....."
                      className="w-xl border bg-white/20  border-black px-3 py-3 rounded focus:border-2 "
                     
                    />
                 </div>
                  

                 <div className="flex flex-col gap-1 mb-3">
                    <p>Amount</p>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="amount"
                        className="w-xl border bg-white/20 border-black px-3 py-3 rounded focus:border-2 "
                      
                      />
                 </div>

                  <div className="flex flex-col gap-1 mb-3">
                    <p>Month</p>
                    <input
                        type="month"
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="date"
                        className="w-xl border bg-white/20 border-black px-3 py-3 rounded focus:border-2 "
                      
                     />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 cursor-pointer"
                  >
                    Set Budget
                  </button>
                    
              </form>

            </div>

          </div>          
             
      </div>
  )
}

export default Budgets