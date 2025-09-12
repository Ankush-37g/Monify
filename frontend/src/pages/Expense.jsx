
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from 'react-chartjs-2'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { assets } from "../assets/assets";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { toast } from "react-toastify";
import api from "../utils/Api.js";

const Expense = () => {

  const {expenses, setExpenses, checkBudgetLimits, setIsLoading} = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)

  const [expenseCategory, setExpenseCategory] = useState("")

  const [amount, setAmount] = useState("")

  const [date, setDate] = useState("")

  const [isRecurring, setIsRecurring] = useState(false)

  const [frequency,setFrequency] = useState(null)
  

  const data = {
        labels: expenses.map((expense) =>

                new Date(expense.date).toLocaleDateString("en-GB",{
                      day: "2-digit",
                      month: "short",
                })),

        datasets: [
        {
          label: "Expense",
          data: expenses.map((expense)=> expense.amount),
          fill: true,
          borderColor: "#27c8a2", // teal
          backgroundColor: (context) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) {
              // Chart not fully initialized
              return null;
            }
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "rgba(39, 200, 162, 0.4)");  // teal with opacity
            gradient.addColorStop(1, "rgba(39, 200, 162, 0.05)"); // fade out transparent
            return gradient;
          },
          pointBackgroundColor: "#27c8a2",
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4, // smooth curves
        },
      ],


  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { borderDash: [0] },
          ticks: {
          stepSize: 500, 
         
         },
          beginAtZero: true,
        },
      },
  };

  const onSubmitHandler = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
          const response = await api.post('/expense/add', {expenseCategory,amount,date,isRecurring,frequency});

          // console.log(response.data)

          if(response.data.success)
          {
              const newExpense = response.data.data;
              
              // Check budget limits before adding expense
              checkBudgetLimits(newExpense);

              setExpenses((prev) => [...prev, newExpense]);
              toast.success(response.data.message);
              
              // Reset form fields
              setExpenseCategory("");
              setAmount("");
              setDate("");
              setIsRecurring(false);
              setFrequency(null);
              
              // Close the modal
              setIsOpen(false);
          }
       } catch (error) {
           if (error.response && error.response.data) {
            toast.error(error.response.data.message || "Something went wrong!");
            console.log(error.response.data);
           } else {
            toast.error(error.message || "Network Error");
            console.log(error.message);
           }
       } finally {
           setIsLoading(false);
       }
      
       
      
  }
  const handleDeleteExpense = async(id) => {

    setIsLoading(true)
        
    try {

      const response = await api.post('/expense/delete',{id})

      console.log(response.data)

      if(response.data.success)
      {
         toast.success("Expense deleted successfully")

         setExpenses(prev => prev.filter(expense => expense._id !== id))
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
    }finally {
        setIsLoading(false);
    }
  }  

      


  return (
    <div className='flex flex-col gap-4  relative text-gray-200'>
        
          {/* Line chart for expenses*/}
          <div className='border-0 px-5 pt-5 pb-5 shadow-lg bg-gray-900 rounded-xl w-full flex flex-col'>
                
                <div className="flex justify-between">

                  <div className="flex flex-col gap-0.5 mb-5" >
                      <p className='text-3xl font-semibold '>Expense Overview</p>
                      <p className="font-light">Visualize your expenses and discover where your money really goes.</p>

                  </div>
                  
                   <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 md:px-4 px-2 py-3 rounded-xl h-10 bg-gray-200 text-black cursor-pointer ">

                      <IoAdd className="w-5 h-5 font-bold"/>
                      <p className="font-bold">Add Expense</p>

                   </div>

                </div>
                 
                <div className="h-80 mb-1 w-full">
                        
                        <Line data={data} options={options}  />

                </div>
                        
          </div> 

          {/* Expense sources */} 
          <div className='border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl w-full '>
          
              <div className='flex justify-between items-center'>

                  <p className='text-3xl font-semibold'> Expenses </p>

    
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 mt-6 gap-3'>
                     
                     {
                      expenses.map((expense,index)=>(
                          
                          <div key={index} className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                              <div className='flex gap-3 items-center'>

                                  <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                                  <div className='flex flex-col'>

                                    <p className='font-semibold'>{expense.expenseCategory}</p>

                                    <p className='font-light'>
                                      {new Date(expense.date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                      })}
                                    </p>
                                    
                                  </div>

                              </div>

                              <div className="flex items-center gap-8">

                                <RiDeleteBin6Line onClick={()=>handleDeleteExpense(expense._id)} className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                                <div className='px-3 py-1 bg-red-400 flex items-center gap-2 rounded-xl'>
                                
                                    <p>+${expense.amount}</p>
                                    <FaArrowTrendDown className='w-3 h-3' />
                                
                                 </div>
                              </div>
                                
                              


                           </div>
                      ))
                     }

                    

                  
              </div>

                
          </div>


          {/* Add Expense Modal */}
          <div className={`fixed text-black inset-0 flex justify-center items-center z-50 px-4 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-black/50 backdrop-blur-sm" : "opacity-0 invisible"
          }`}>
            <div className={`bg-gray-200 rounded-xl p-4 sm:p-5 shadow-lg w-full max-w-md mx-auto transform transition-transform duration-300 ${
              isOpen ? "scale-100" : "scale-90"
            }`}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-xl sm:text-2xl font-semibold">Add Expense</p>
                <RxCross2
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 cursor-pointer hover:bg-gray-300 rounded-full p-1"
                />
              </div>

              <hr className="border-gray-300 mb-6"/>

              {/* Form */}
              <form onSubmit={onSubmitHandler} className="space-y-4">
                {/* Category Field */}
                <div className="space-y-1">
                  <label htmlFor="expenseCategory" className="text-sm font-medium">Category</label>
                  <input
                    type="text"
                    id="expenseCategory"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    placeholder="Loan Repayment, Rent ..."
                    className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Amount Field */}
                <div className="space-y-1">
                  <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-red-500 focus:border-transparent pl-7"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Date Field */}
                <div className="space-y-1">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Recurring Expense Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isRecurring} 
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded border-gray-400 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium">Set as regular expense</span>
                  </label>

                  {isRecurring && (
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-white/20 border border-gray-400 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={isRecurring}
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full bg-black text-white py-2.5 sm:py-3 rounded font-medium hover:bg-gray-800 transition-colors duration-200 mt-6"
                >
                  Add Expense
                </button>
              </form>
            </div>
          </div>

          
          
    </div>
  )
}

export default Expense