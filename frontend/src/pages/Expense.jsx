
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from 'react-chartjs-2'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { assets } from "../assets/assets";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const Expense = () => {

  const [isOpen, setIsOpen] = useState(false)

  const [incomeSource, setIncomeSource] = useState("")

  const [amount, setAmount] = useState("")

  const [date, setDate] = useState("")

  const data = {
        labels: [
          "2nd Jan",
          "3rd Jan",
          "4th Jan",
          "5th Jan",
          "6th Jan",
          "7th Jan",
          "8th Jan",
          "9th Jan",
          "10th Jan",
          "11th Jan",
          "12th Jan",
          "14th Jan",
          "11th Feb",
          "17th Feb",
        ],
        datasets: [
        {
          label: "Expense",
          data: [500, 200, 150, 250, 100, 550, 450, 700, 800, 850, 600, 300, 550, 400],
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
              beginAtZero: true,
            },
          },
        };


  return (
    <div className='flex flex-col gap-4  relative text-gray-200'>
        
          {/* Line chart for expenses*/}
          <div className='border-0 px-5 pt-5 pb-5 shadow-lg bg-gray-900 rounded-xl w-full flex flex-col'>
                
                <div className="flex justify-between">

                  <div className="flex flex-col gap-0.5 mb-5" >
                      <p className='text-3xl font-semibold '>Expense Overview</p>
                      <p className="font-light">Visualize your expenses and discover where your money really goes.</p>

                  </div>
                  
                   <div onClick={()=>setIsOpen(true)} className="flex items-center gap-1 px-4 rounded-xl h-10 bg-green-300 cursor-pointer ">

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

              </div>

                
          </div>


          {/* Add expense */}
          <div className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
              isOpen ? "opacity-100 visible bg-transparent bg-opacity-30 backdrop-blur-xs" : "opacity-0 invisible"
                }`}>

            <div
              className={`bg-gray-950 rounded-xl p-5 shadow-lg shadow-gray-700 text-white transform transition-transform duration-300 ${
                isOpen ? "scale-100" : "scale-90"
              }`}
            >
              <div className="flex justify-between items-center mb-3">

                <p className="text-2xl font-semibold ">Add Expense</p>

                <RxCross2
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 cursor-pointer"
                />

              </div>

              <hr className="font-extralight mb-8"/>

              <form action="">


                 <div className="flex flex-col gap-1 mb-3 ">
                   <p>Category</p>
                   <input
                      type="text"
                      id="IncomeSource"
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                      placeholder="Loan Repayment, Rent ..."
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

export default Expense