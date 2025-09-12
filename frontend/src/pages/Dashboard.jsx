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

   const {navigate,totalIncome,totalExpense,balance,expenses,incomes,budgets} = useContext(UserContext)

   const today = new Date()
   
   const thirtyDaysAgo = new Date()
   
   const sixtyDaysAgo = new Date()

   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

   sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30)

   const ThirtyDaysExpenses = expenses.filter((expense)=> new Date(expense.date) > thirtyDaysAgo)
    
   const SixtyDaysIncomes = incomes.filter((income)=> new Date(income.date) > sixtyDaysAgo)


   const FourExpenses = expenses.slice(-4).reverse()

   const FourIncomes = incomes.slice(-4).reverse()

   const FourBudgets = budgets.slice(-3).reverse()


   const transactions = [

      ...incomes.map(income => ({
                id: income._id,
                title: income.incomeSource,
                date: income.date,
                amount: income.amount,
                type: "income",
      })),

      ...expenses.map(expense => ({
                id: expense._id,
                title: expense.expenseCategory,
                date: expense.date,
                amount: expense.amount,
                type: "expense",
      }))

   ];

  // Sort by date (latest first)
   const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
   );
   
   const recentTransactions = sortedTransactions.slice(0, 4);

   const OverviewDoughnutData = {
      labels: ["Balance", "Income", "Expense"],

      datasets: [
        {
          label: "",
          data: [balance, totalIncome, totalExpense], // Values for each slice
          backgroundColor: [
             "rgba(20, 184, 166, 1)", // Teal
             "rgba(59, 130, 246, 1)", // Blue
             "rgba(239, 68, 68, 1)", // Red
          ],
          borderColor: [
            ""
          ],
          borderWidth: 0,
        },
      ],
    };
    const OverviewDoughnutOptions={
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
    }
    
    const ExpenseBarData = {
      
      labels: ThirtyDaysExpenses.map((expense) =>

              new Date(expense.date).toLocaleDateString("en-GB",{
                    day: "2-digit",
                    month: "short",
              })),

      datasets: [
        {
          label: "Expenses",
          data: ThirtyDaysExpenses.map((expense)=> expense.amount), 
          backgroundColor: "rgba(139,92,246,0.7)", // purple shade
          borderRadius: 8, // rounded corners
        },
      ],
                   
    }

    const ExpenseBarOptions = {
      
      responsive: true,
      maintainAspectRatio:false,
      plugins: {
        legend: { display: false }, 
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

    const IncomeDoughnutdata={
          labels: SixtyDaysIncomes.map(income => income.incomeSource),
          datasets: [
            {
              label: "",
              data: SixtyDaysIncomes.map(income => income.amount), // Example values
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
  }

  const IncomeDoughnutOptions={
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%", // Donut thickness
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 18,
              padding: 12,
              color: "gray", // dark gray text
              font: {
                size: 12,
              },
            },
          },
        },
  }



   return (

    <div className='flex flex-col gap-10'>

         {/* Three cards for balance , income and expenses */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-20 sm:gap-15 w-full '>

           {/* Balance */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm mx-auto border-3 border-green-500 ">

               <div className='flex items-center justify-between'>
                   <p className="text-sm font-semibold tracking-wide uppercase">
                              Total Balance
                   </p>

                   <MdAccountBalanceWallet className='w-7 h-7 text-teal-600' />

               </div>
             
               <p className="mt-4 text-3xl font-bold text-teal-600">${balance}</p>

            </div>

              {/* Income */}
             <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm  mx-auto border-3 border-blue-500">

              <div className='flex items-center justify-between'>

                 <p className="text-sm font-semibold tracking-wide uppercase">
                  Total Income
                 </p>

                 <FaArrowTrendUp className='w-7 h-7 text-blue-500' />

              </div>
               
              <p className="mt-4 text-3xl font-bold text-blue-500">${totalIncome}</p>
            </div>

             {/* Expenses */}
             <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-xl overflow-hidden w-full max-w-sm mx-auto border-3 border-red-500">

                 <div className='flex items-center justify-between'>

                   <p className="text-sm font-semibold tracking-wide uppercase">
                              Total Expenses
                   </p>
                   
                   
                   <FaArrowTrendDown className='w-7 h-7 text-red-500'/>
                   
                  </div>
               <p className="mt-4 text-3xl font-bold text-red-500">${totalExpense}</p>
            </div>

        </div>

        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4  w-full text-gray-200'>

             {/* Recent Transactions */}
             <div className='border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl  h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-3xl font-semibold'>Recent Transactions</p>

                 </div>

                 <div className='flex flex-col mt-6 gap-3 '>

                    {
                      recentTransactions.map((transaction,index)=>(

                           <div key = {index} className='flex justify-between items-center p-3 '>

                                <div className='flex gap-3 items-center'>

                                  <img className='w-7 rounded-full overflow-hidden object-cover ' src={assets.logo2} alt="" />

                                  <div className='flex flex-col'>

                                    <p className='font-semibold'>{transaction.title}</p>
                                    <p className='font-light'>
                                      { new Date(transaction.date).toLocaleDateString("en-GB",{
                                                              day: "2-digit",
                                                              month: "short",
                                      })}
                                    </p>
                                    
                                  </div>

                                </div>
                                
                               

                                {
                                  transaction.type === "income" ?
                                  <div className='px-3 py-1 bg-teal-600 flex items-center gap-2 rounded-xl'>
                                    <p>+${transaction.amount}</p>
                                    <FaArrowTrendUp className='w-3 h-3' />
                                  </div>
                                  :
                                    <div className='px-3 py-1 bg-red-400 flex items-center gap-2 rounded-xl'>
                                    <p>-${transaction.amount}</p>
                                    <FaArrowTrendDown className='w-3 h-3' />
                                  </div>
                                    
                                }
                                    

                                

                            </div>
                      ))
                    }

                    

                 

                    
                 </div>

                    
             </div>

            {/* Financial Overview Pie Chart */}
            <div className='border-0 px-5 pt-5 pb-10 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

                  <div className='flex justify-between items-center'>

                     <p className='text-3xl font-semibold '>My Budgets</p>

                     <div onClick={()=>navigate('/Budget')} className='bg-gray-700 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                  {
                    FourBudgets.map((budget, index) => {

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
                          <div key={index} className="backdrop-blur-sm my-5 bg-gray-800/70 p-3 rounded-2xl shadow-lg border border-gray-700">

                            <div className="flex flex-col    group">

                              <h3 className="text-xl font-bold text-blue-400">{budget.category}</h3>
                                    
                                                    
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
           
            {/* Expenses */}
            <div className='border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-3xl font-semibold'>Expenses</p>

                     <div onClick={()=>navigate('/Expense')} className='bg-gray-700 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                 <div className='flex flex-col mt-6 gap-3'>
                     {
                       FourExpenses.map((expense,index)=>(

                          <div key={index} className='flex justify-between items-center p-3'>

                              <div className='flex gap-3 items-center'>

                                <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                                <div className='flex flex-col'>

                                  <p className='font-semibold'>{expense.expenseCategory}</p>
                                  <p className='font-light'>
                                       { new Date(expense.date).toLocaleDateString("en-GB",{
                                                              day: "2-digit",
                                                              month: "short",
                                      })}

                                  </p>
                                  
                                </div>

                              </div>
                              
                              <div className='px-3 py-1 bg-red-400 flex items-center gap-2 rounded-xl'>

                                  <p>+${expense.amount}</p>
                                  <FaArrowTrendDown className='w-3 h-3'/>

                              </div>


                          </div>
                       ))
                     }
                    
     
                      
                 </div>

         
                    
            </div>


             {/* Last 30 days Expense */}
            <div className='border-0 px-5 pt-5 pb-2 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

                  <p className='text-3xl font-semibold mb-2'>Last 30 Days Expenses</p>

                  <Bar 
                      data ={ExpenseBarData}
                      options = {ExpenseBarOptions}
                      className="w-full h-full mb-10 " 
                  />

            </div>  

             {/* Last 60 days Income */}
             <div className='border-0 px-5 pt-5 pb-10 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl  items-center justify-center h-110 '>

                <p className='text-3xl font-semibold mb-2'>Last 60 Days Income</p>

                <Doughnut 
                      data={IncomeDoughnutdata}

                      options={IncomeDoughnutOptions}
                      className="w-full h-full mb-3"
                />


             </div> 

              {/* Income */}
             <div className='border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl w-full sm:max-w-xl h-110 '>

                 <div className='flex justify-between items-center'>

                     <p className='text-3xl font-semibold'>Income</p>

                     <div onClick={()=>navigate('/Income')} className='bg-gray-700 flex gap-1.5 items-center justify-center px-2 py-1 rounded-xl transition duration-280 hover:scale-105 hover:shadow-xl cursor-pointer'>
                          <p>See All</p>
                          <IoArrowForward />

                     </div>
                 </div>

                 <div className='flex flex-col-reverse mt-6 gap-3'>

                 {
                   FourIncomes.map((income,index)=>(
                       
                    <div key={index} className='flex justify-between items-center p-3'>

                              <div className='flex gap-3 items-center'>

                                <img className='w-7 rounded-full overflow-hidden object-cover bg-gray-100' src={assets.logo2} alt="" />

                                <div className='flex flex-col'>

                                  <p className='font-semibold'>{income.incomeSource}</p>
                                  <p className='font-light'>
                                       { new Date(income.date).toLocaleDateString("en-GB",{
                                                              day: "2-digit",
                                                              month: "short",
                                      })}

                                  </p>
                                  
                                </div>

                              </div>
                              
                              <div className='px-3 py-1 bg-teal-600 flex items-center gap-2 rounded-xl'>

                                  <p>+${income.amount}</p>
                                  <FaArrowTrendUp className='w-3 h-3'/>

                              </div>


                      </div>
                   ))
                 }

                 </div>

                 




             </div>

     
            
        </div>
        

    </div>

  )
}

export default Dashboard