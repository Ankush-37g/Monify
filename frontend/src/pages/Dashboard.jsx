import React from 'react'
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import { Pie , Doughnut, Bar} from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto";
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import { IoArrowForward } from "react-icons/io5";
import { assets } from '../assets/assets';

const Dashboard = () => {

   const {navigate} = useContext(UserContext)

   const {balance, income, expense} = useContext(UserContext)

   const data = {
      labels: ["Balance", "Income", "Expense"],

      datasets: [
        {
          label: "",
          data: [150, 100, 50], // Values for each slice
          backgroundColor: [
            "rgba(0, 255, 0, 0.7)",
            "rgba(0, 0, 255, 0.65)",
            "rgba(255, 0, 0, 0.8)",
          ],
          borderColor: [
            ""
          ],
          borderWidth: 0,
        },
      ],
    };

   return (

    <div className='flex flex-col gap-10'>

         {/* Three cards for balance , income and expenses */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-20 sm:gap-15 w-full '>

           {/* Balance */}
            <div className="bg-green-500 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm mx-auto ">

               <div className='flex items-center justify-between'>
                   <p className="text-sm font-semibold tracking-wide uppercase">
                              Total Balance
                   </p>

                   <MdAccountBalanceWallet className='w-7 h-7' />

               </div>
             
               <p className="mt-4 text-3xl font-extrabold">$4,000.00</p>

            </div>

              {/* Income */}
             <div className="bg-blue-500 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm  mx-auto">

              <div className='flex items-center justify-between'>

                 <p className="text-sm font-semibold tracking-wide uppercase">
                  Total Income
                 </p>

                 <FaArrowTrendUp className='w-7 h-7' />

              </div>
               
              <p className="mt-4 text-3xl font-extrabold">$4,000.00</p>
            </div>

             {/* Expenses */}
             <div className="bg-red-500 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm mx-auto">

                 <div className='flex items-center justify-between'>

                   <p className="text-sm font-semibold tracking-wide uppercase">
                              Total Expenses
                   </p>
                   
                   
                   <FaArrowTrendDown className='w-7 h-7'/>
                   
                  </div>
               <p className="mt-4 text-3xl font-extrabold">$4,000.00</p>
            </div>

        </div>

        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4  w-full '>

             {/* Recent Transactions */}
             <div className='border border-amber-100 p-5 shadow-lg bg-white rounded-xl w-full sm:max-w-xl  h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-xl font-semibold'>Recent Transactions</p>

                     <div className='bg-gray-200 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                 <div className='flex flex-col-reverse mt-6 gap-3'>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>
                 </div>

                    
             </div>

            {/* Financial Overview Pie Chart */}
            <div className='border-0 px-5 pt-5 pb-10 shadow-lg bg-white rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

              <p className='text-xl font-semibold mb-2'>Financial Overview</p>
              <Doughnut 
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // chart fills container
                  cutout: '70%', 
                  plugins: {
                    legend: {
                      position: 'bottom', 
                      labels: {
                        boxWidth: 20, 
                        padding: 15, 
                    },
                  },
                },
              }} className="w-full h-full" />
            </div>  
           
            {/* Expenses */}
            <div className='border border-amber-100 p-5 shadow-lg bg-white rounded-xl w-full sm:max-w-xl h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-xl font-semibold'>Expenses</p>

                     <div className='bg-gray-200 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                 <div className='flex flex-col-reverse mt-6 gap-3'>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-red-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendDown className='w-3 h-3'/>

                       </div>


                    </div>

                   
                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-red-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendDown className='w-3 h-3'/>

                       </div>


                    </div>

                                        <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-red-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendDown className='w-3 h-3'/>

                       </div>


                    </div>

                                        <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-red-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendDown className='w-3 h-3'/>

                       </div>


                    </div>

                                        <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-red-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendDown className='w-3 h-3'/>

                       </div>


                    </div>

                    
                 </div>

         
                    
            </div>

                 

             {/* Last 30 days Expense */}
             <div className='border-0 px-5 pt-5 pb-10 shadow-lg bg-white rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

              <p className='text-xl font-semibold mb-2'>Last 30 Days Expenses</p>
              <Bar 
                  data ={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [
                      {
                        label: "Expenses",
                        data: [450, 700, 200, 600], // Example data
                        backgroundColor: "rgba(139,92,246,0.7)", // purple shade
                        borderRadius: 8, // rounded corners
                      },
                    ],
                   }}

                  options = {{
                    responsive: true,
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
                  }}
                
              className="w-full h-full mt-8" />
            </div>  

             {/* Last 60 days Income */}
             <div className='border-0 px-5 pt-5 pb-10 shadow-lg bg-white rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

                <p className='text-xl font-semibold mb-2'>Last 60 Days Income</p>

                <Doughnut 
                      data={{
                        labels: ["Salary", "Investments", "Interest", "Freelance", "Other Income"],
                        datasets: [
                          {
                            label: "",
                            data: [500, 200, 100, 150, 50], // Example values
                            backgroundColor: [
                              "rgba(139, 92, 246, 0.8)",  // Purple
                              "rgba(16, 185, 129, 0.8)",  // Green
                              "rgba(59, 130, 246, 0.8)",  // Blue
                              "rgba(249, 115, 22, 0.8)",  // Orange
                              "rgba(236, 72, 153, 0.8)",  // Pink
                            ],
                            borderWidth: 2,
                            borderColor: "#fff", // White separation between slices
                            hoverOffset: 10, // Slight pop effect on hover
                          },
                        ],
                      }}

                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "70%", // Donut thickness
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              boxWidth: 18,
                              padding: 12,
                              color: "#374151", // dark gray text
                              font: {
                                size: 13,
                              },
                            },
                          },
                        },
                      }}
                      className="w-full h-full"
                    />


             </div> 

              {/* Income */}
             <div className='border border-amber-100 p-5 shadow-lg bg-white rounded-xl w-full sm:max-w-xl h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-xl font-semibold'>Income</p>

                     <div onClick={()=>navigate('/Income')} className='bg-gray-200 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                 <div className='flex flex-col-reverse mt-6 gap-3'>

                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                         <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                   
                    <div className='flex justify-between items-center'>

                      <div className='flex gap-3 items-center'>

                         <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                         <div className='flex flex-col'>

                           <p className='font-semibold'>Shopping</p>
                           <p className='font-light'>15th Aug 2025</p>
                           
                         </div>

                      </div>
                       
                       <div className='px-3 py-1 bg-green-300 flex items-center gap-2 rounded-xl'>

                          <p>+$10000</p>
                          <FaArrowTrendUp className='w-3 h-3' />

                       </div>


                    </div>

                    
                 </div>

                    
             </div>

            
        </div>
        

    </div>

  )
}

export default Dashboard