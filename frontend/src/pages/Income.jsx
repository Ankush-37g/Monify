
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from 'react-chartjs-2'
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


const Income = () => {

  const {incomes,setIncomes,setIsLoading} = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)

  const [incomeSource, setIncomeSource] = useState("")

  const [amount, setAmount] = useState("")

  const [date, setDate] = useState("")

  const [isRecurring,setIsRecurring] = useState(false)

  const [frequency, setFrequency] = useState(null)


  const data ={
      labels: incomes.map(income => 
        new Date(income.date).toLocaleDateString("en-GB",{
          day: "2-digit",
          month: "short",
        })
      ), 
      datasets: [
        {
          label: "Incomes",
          
          data: incomes.map((income)=> income.amount ),

          backgroundColor: (context) => {
          const chart = context.chart;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          if (!chartArea) {
            // Chart hasn't been drawn yet
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(39, 200, 162, 0.6)");  // teal with opacity
          gradient.addColorStop(1, "rgba(39, 200, 162, 0.2)"); // fade out
          return gradient;
          },
          borderRadius: 8,
        },
      ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // hide legend
      title: { display: false },
    },
    scales: {
      x:{
        ticks:{
          color: "white",
        },
        grid:{
          borderColor:"white",
          borderWidth: 2,        // make it visible/bolder
          drawBorder: true,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          // stepSize: 2000, // control the spacing between ticks
          callback: (value) => `₹${value}`, // optional: add currency symbol
          color: "white",
        },
        grid: {
          borderColor: "white"
        }
      },
    },
  }

  const onSubmitHandler = async(e) => {

        e.preventDefault()
        setIsLoading(true)
       try {
         
          const response = await api.post('/income/add', {incomeSource,amount,date,isRecurring,frequency});

          // console.log(response.data)

          if(response.data.success)
          {
              toast.success(response.data.message)

              setIncomes((prev) => [...prev,response.data.data])
              
              setIncomeSource("")
              setAmount("")
              setDate("")
              setIsRecurring(false)
              setFrequency(null)

              setIsOpen(false)
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
       }finally{
          setIsLoading(false)
       }
      
       
      
  }
  const handleDeleteIncome = async(id) => {
    setIsLoading(true) 
    try {

      const response = await api.post('/income/delete',{id})

      console.log(response.data)

      if(response.data.success)
      {
         toast.success("Income deleted successfully")

         setIncomes(prev => prev.filter(income => income._id !== id))
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
    finally{
      setIsLoading(false)
    }
  }
                

  return (
    <div className='flex flex-col gap-4  relative text-gray-200'>
        
          {/* Bar chart for income based on dates*/}
          <div className='border-0 px-5 pt-5 pb-5 shadow-lg bg-gray-900 rounded-xl w-full flex flex-col'>
                
                <div className="flex justify-between">

                  <div className="flex flex-col gap-0.5 mb-5" >
                      <p className='text-3xl font-semibold '>Income Overview</p>
                      <p className="font-light">See how your earnings evolve across time and identify key income shifts.</p>

                  </div>
                  
                   <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 sm:px-4 px-2 sm:py-2  rounded-xl h-10 bg-gray-200 text-black cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out ">

                      <IoAdd className="w-5 h-5 font-bold"/>
                      <p className="font-bold">Add Income</p>

                   </div>

                </div>
                 
                <div className="h-80 mb-1">
                    <Bar data = {data} options={options}/>
                  </div>
                        
          </div> 

          {/* Income sources */} 
          <div className='p-5 shadow-lg bg-gray-900 rounded-xl w-full '>
          
              <div className='flex justify-between items-center'>

                  <p className='text-3xl font-semibold'> Income Sources </p>

    
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 mt-6 gap-3'>
                     
                     {
                      incomes.map((income,index)=>(
                          
                          <div key={index} className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                              <div className='flex gap-3 items-center'>

                                  <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                                  <div className='flex flex-col'>

                                    <p className='font-semibold'>{income.incomeSource}</p>
                                    <p className='font-light'>
                                      {new Date(income.date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                      })}
                                    </p>
                                    
                                  </div>

                              </div>

                              <div className="flex items-center gap-8">

                                <RiDeleteBin6Line onClick={()=>handleDeleteIncome(income._id)} className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                                <div className='px-3 py-1 bg-teal-600 flex items-center gap-2 rounded-xl'>
                                
                                    <p>+${income.amount}</p>
                                    <FaArrowTrendUp className='w-3 h-3' />
                                
                                 </div>
                              </div>
                                
                              


                           </div>
                      ))
                     }

                    

              </div>

                
          </div>

          {/* Add Income Modal */}
          <div className={`fixed inset-0 flex text-black justify-center items-center z-50 px-4 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-black/50 backdrop-blur-sm" : "opacity-0 invisible"
          }`}>

            <div className={`bg-gray-200 rounded-xl p-4 sm:p-5 shadow-lg w-full max-w-md mx-auto transform transition-transform duration-300 ${
              isOpen ? "scale-100" : "scale-90"
            }`}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-xl sm:text-2xl font-semibold">Add Income</p>
                <RxCross2
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 cursor-pointer hover:text-gray-700"
                />
              </div>

              <hr className="border-gray-300 mb-6"/>

              {/* Form */}
              <form onSubmit={onSubmitHandler} className="space-y-4">
                {/* Income Source Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Income Source</label>
                  <input
                    type="text"
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                    placeholder="Salary, Freelance ..."
                    className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Amount Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Date Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 sm:py-3 rounded border border-gray-400 bg-white/20 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Recurring Income Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isRecurring} 
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded border-gray-400 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">Set as regular income</span>
                  </label>

                  {isRecurring && (
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-white/20 border border-gray-400 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full bg-black text-white py-2.5 sm:py-3 rounded font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Add Income
                </button>
              </form>
            </div>
          </div>

          
          
    </div>
  )
}

export default Income