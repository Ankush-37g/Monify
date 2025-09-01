
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
import axios from "axios"

const Income = () => {

  const {incomes,backendUrl} = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)

  const [incomeSource, setIncomeSource] = useState("")

  const [amount, setAmount] = useState("")

  const [date, setDate] = useState("")

  const data ={
      labels: ["15 Jul", "20 Jul","28 Jul", "1 Jul", "3 Aug", "10 Aug", "10Aug", "17 Aug"], 
      datasets: [
        {
          label: "Expenses",
          
          data: [450, 700, 200, 600,100,250,1000,370],

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
          stepSize: 200,
          color: "white"
        },
        grid: {
          borderColor: "white"
        }
      },
    },
  }

  const onSubmitHandler = async(e) => {

        e.preventDefault()

       try {
         
          const response = await axios.post(backendUrl + '/api/income/add', {incomeSource,amount,date},{ withCredentials: true });

          console.log(response.data)

          if(response.data.success)
          {
              toast.success(response.data.message)
              
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
            }
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
                  
                   <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 px-4 rounded-xl h-10 bg-gray-200 text-black cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out ">

                      <IoAdd className="w-5 h-5 font-bold"/>
                      <p className="font-bold">Add Income</p>

                   </div>

                </div>
                 
                <div className="h-80 mb-1">
                    <Bar data = {data} options={options}/>
                  </div>
                        
          </div> 

          {/* Income sources */} 
          <div className='border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl w-full '>
          
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

                                <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                                <div className='px-3 py-1 bg-teal-600 flex items-center gap-2 rounded-xl'>
                                
                                    <p>+$10000</p>
                                    <FaArrowTrendUp className='w-3 h-3' />
                                
                                 </div>
                              </div>
                                
                              


                           </div>
                      ))
                     }

                    

                   { /*
                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    
                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-700'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-400 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div> */}

              </div>

                
          </div>


         {/* Add Income */}
          <div className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-transparent bg-opacity-30 backdrop-blur-xs" : "opacity-0 invisible"
                }`}>

            <div
              className={`bg-gray-200 rounded-xl p-5 shadow-lg shadow-gray-700 text-black transform transition-transform duration-300 ${
                isOpen ? "scale-100" : "scale-90"
              }`}
            >
              <div className="flex justify-between items-center mb-3">

                <p className="text-2xl font-semibold ">Add Income</p>

                <RxCross2
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 cursor-pointer"
                />

              </div>

              <hr className="font-extralight mb-8"/>

              <form onSubmit={onSubmitHandler}>


                 <div className="flex flex-col gap-1 mb-3 ">
                   <p>Income Source</p>
                   <input
                      type="text"
                      id="IncomeSource"
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                      placeholder="Salary, Freelance ..."
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
                    <p>Date</p>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="date"
                        className="w-xl border bg-white/20 border-black px-3 py-3 rounded focus:border-2 "
                      
                     />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-black text-white py-2 px-4 rounded mt-4 hover:bg-gray-800 cursor-pointer"
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