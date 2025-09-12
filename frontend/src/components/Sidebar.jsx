import React from 'react';
import { FaMoneyBillWave, FaChartPie, FaHandHoldingUsd  } from 'react-icons/fa';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const Sidebar = () => {

  const location = useLocation()

  const [activeIndex, setActiveIndex] = useState(null)

  const {user, avatarUrl, setAvatarUrl} = useContext(UserContext)
  
  useEffect(() => {

    if (!localStorage.getItem("avatarUrl")) 
    {
      const randomNum = Math.floor(Math.random() * 50) + 1;
      const newAvatarUrl = `https://avatar.iran.liara.run/public/${randomNum}`;
      setAvatarUrl(newAvatarUrl);
      localStorage.setItem("avatarUrl", newAvatarUrl);
    }
    else
    {
      setAvatarUrl(localStorage.getItem("avatarUrl"));
    }
      
  }, [setAvatarUrl]);

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
      name: 'Budget',
      icon: <FaHandHoldingUsd className='text-xl' />
    
    },
    
  ];

  return (

    <div className="w-full h-full bg-gray-950 shadow-xl p-6 flex flex-col justify-between transition-all duration-300 z-40">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-4">
        <div className="relative w-24 h-24 mb-4 rounded-full bg-gray-800 border-4 border-teal-400 overflow-hidden shadow-lg">
          <img
            src={avatarUrl}
            alt="User profile"
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-xl font-bold text-white mb-8">
          {JSON.parse(localStorage.getItem("user"))?.user?.name}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">

        <ul className="space-y-4">

          {navItems.map((item, index) => {

            const isActive = activeIndex === index || location.pathname === `/${item.name}`;

            return (

              <li key={index}>

                <Link 
                  to={`/${item.name}`}

                  onClick={() => {
                    setActiveIndex(index);
                    navigate("/item.name");
                  }}

                  className={`flex items-center space-x-4 p-3 rounded-xl w-full text-left transition-colors duration-200 
                  ${isActive ? 'bg-teal-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.icon}
                  <span className="font-semibold text-lg">{item.name}</span>
                </Link>

              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
