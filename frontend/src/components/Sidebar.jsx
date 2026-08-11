import React from 'react';
import { FaMoneyBillWave, FaChartPie, FaHandHoldingUsd  } from 'react-icons/fa';
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../utils/Api.js';
import { toast } from 'react-toastify';

const Sidebar = () => {

  const location = useLocation()

  const [activeIndex, setActiveIndex] = useState(null)

  const {user,setUser, avatarUrl, setAvatarUrl,navigate,setVisible} = useContext(UserContext)
  
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
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineSpaceDashboard className="text-xl" /> },
    { name: 'Income',    path: '/income',    icon: <FaMoneyBillWave className="text-xl" /> },
    { name: 'Expense',  path: '/expense',   icon: <FaChartPie className="text-xl" /> },
    { name: 'Budget',   path: '/budget',    icon: <FaHandHoldingUsd className="text-xl" /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <BsStars className="text-xl text-teal-400" /> },
  ];

  const handleLogout = async() => {
  
         try {
            const response = await api.post('/user/logout');
  
            console.log(response.data)
  
            if(response.data.success)
            {
    
                setUser(null)
  
                localStorage.removeItem("user")

                navigate('/')
            }
         } catch (error) {
  
              if (error.response) {
                  // This will log your backend's JSON error message
                  console.log(error.response.data);
                  toast.error(error.response.data.message)
                  
              } else {
                  // Network or other error
                  console.log(error.message)
              }
         }
          
         
  }

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
          {(() => {
            try {
              const userData = JSON.parse(localStorage.getItem("user"));
              return userData?.user?.name || "User";
            } catch (e) {
              return "User";
            }
          })()}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">

        <ul className="space-y-4">

          {navItems.map((item, index) => {

            const isActive = activeIndex === index || window.location.pathname.toLowerCase() === item.path.toLowerCase();            return (

              <li key={index}>

                <Link 
                  to={item.path}

                  onClick={() => {
                    setActiveIndex(index);
                    navigate(item.path);
                    setVisible(false); 
                     
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
          {/* Logout button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 p-3 rounded-xl w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <RiLogoutBoxLine className="text-xl" />
              <span className="font-semibold text-lg">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
