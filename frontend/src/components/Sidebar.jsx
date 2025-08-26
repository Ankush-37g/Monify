import React from 'react';
import { FaMoneyBillWave, FaChartPie, FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import {useState} from 'react'

const Sidebar = () => {

  const location = useLocation()

  const [activeIndex, setActiveIndex] = useState(null)
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: <MdOutlineSpaceDashboard className="text-xl" />,
    
    },
    {
      name: 'Income',
      icon: <FaMoneyBillWave className="text-xl" />,
      
    },
    {
      name: 'Expense',
      icon: <FaChartPie className="text-xl" />,
    
    },
    {
      name: 'Logout',
      icon: <FaSignOutAlt className="text-xl" />,
      
    },
  ];

  return (

    <div className=" w-full h-full bg-white  shadow-xl p-6 flex flex-col justify-between transition-all duration-300 z-40">

      {/* Profile Section */}
       <div className="flex flex-col items-center p-4">

        <div className="relative w-24 h-24 mb-4 rounded-full bg-white border-4 border-green-200 overflow-hidden shadow-lg">

          <img
            src="https://placehold.co/100x100/A0B2C9/FFFFFF?text=User"
            alt="User profile"
            className="object-cover w-full h-full"
          />

        </div>

        <h2 className="text-xl font-bold text-black mb-8">Ankush Sharma</h2>

      </div>

      {/* Navigation Links */}
      <nav className="flex-1">

        <ul className="space-y-4">

          {
            navItems.map((item, index) => {

              const isActive = activeIndex === index || location.pathname === `/${item.name}`

              return(
                  <li key={index} >

                      <Link to={`/${item.name}`}
              
                        onClick={()=>setActiveIndex(index)}

                        className={`flex items-center space-x-4 p-3 rounded-xl transition-colors duration-200 
                          ${isActive ? 'bg-green-600 text-white shadow-md' : 'text-black hover:bg-green-100'}`}
                      >

                          {item.icon}

                          <span className="font-semibold text-lg">{item.name}</span>

                      </Link>

                  </li>
              )

           
            })

          }

        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
