
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from 'react-chartjs-2'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { assets } from "../assets/assets";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const Income = () => {

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
          backgroundColor: "rgba(34, 197, 94, 0.4)",
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
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
      },
    },
  }
                        

  return (
    <div className='flex flex-col gap-4  relative'>
        
          {/* Bar chart for income based on dates*/}
          <div className='border-0 px-5 pt-5 pb-5 shadow-lg bg-white rounded-xl w-full flex flex-col'>
                
                <div className="flex justify-between">

                  <div className="flex flex-col gap-0.5 mb-5" >
                      <p className='text-3xl font-semibold '>Income Overview</p>
                      <p className="font-light">See how your earnings evolve across time and identify key income shifts.</p>

                  </div>
                  
                   <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 px-4 rounded-xl h-10 bg-green-300 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out ">

                      <IoAdd className="w-5 h-5 font-bold"/>
                      <p className="font-bold">Add Income</p>

                   </div>

                </div>
                 
                <div className="h-80 mb-1">
                    <Bar data = {data} options={options}/>
                  </div>
                        
          </div> 

          {/* Income sources */} 
          <div className='border border-amber-100 p-5 shadow-lg bg-white rounded-xl w-full '>
          
              <div className='flex justify-between items-center'>

                  <p className='text-3xl font-semibold'> Income Sources </p>

    
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 mt-6 gap-3'>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    
                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    
                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

                    <div className='flex justify-between items-center p-2 rounded group hover:bg-gray-100'>

                          <div className='flex gap-3 items-center'>

                              <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                              <div className='flex flex-col'>

                                <p className='font-semibold'>Shopping</p>
                                <p className='font-light'>15th Aug 2025</p>
                                
                              </div>

                          </div>

                          <div className="flex items-center gap-8">

                            <RiDeleteBin6Line className="hidden group-hover:block w-5 h-5 cursor-pointer "/>

                            <div className='px-2 py-0.5 bg-red-300 flex items-center gap-2 rounded-xl'>

                              <p>+$10000</p>
                              <FaArrowTrendDown className='w-3 h-3'/>

                            </div>
                          </div>
                            
                          


                    </div>

              </div>

                
          </div>

          <div className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-transparent bg-opacity-30 backdrop-blur-xs" : "opacity-0 invisible"
                }`}>

            <div
              className={`bg-gray-950 rounded-xl p-5 shadow-lg shadow-gray-700 text-white transform transition-transform duration-300 ${
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

              <form action="">


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
                    
              </form>

            </div>

          </div>

          
          
    </div>
  )
}

export default Income