import React from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { assets } from "../assets/assets";
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';



const Header = () => {

  const {navigate,visible,setVisible,user,setUser} = useContext(UserContext)

  const location = window.location.pathname;

 
  const handleNavigation = () => {
    
    if (!localStorage.getItem("user")) {
      navigate('/login');
      return;
    }
    
    // If on dashboard, go to home, else go to dashboard
    if (location === '/dashboard') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  }
    
  return (

     <div className="fixed top-0 left-0 right-0 z-50  h-18 flex justify-between backdrop-blur-lg  bg-gray-950">
    
                <div className="flex items-center md:ml-2">
                    
                  {
                    localStorage.getItem("user") && location !== '/' && 
                      (
                        visible ? <RxCross2 onClick={()=>setVisible(false)} className={`md:hidden block w-10 h-10  text-teal-500 bg-black cursor-pointer`} />      
                        : <IoMenuOutline onClick={()=>setVisible(true)}
                        className={`md:hidden block w-15 h-12  text-teal-500 bg-gray-950 cursor-pointer `}/> 
                      )
                  
                  }
                  <div className={`flex  items-center gap-2 md:ml-10 ${location !== '/' ? "hidden sm:flex" : "" }`}>
                          <img className=" w-10 " src={assets.logo3} alt="logo" />
                          <p className='text-gray-200 text-3xl sm:text-4xl font-bold '>Monify</p>
                  </div>
                  
                </div>

              
    
               
    
              
                  <button onClick={handleNavigation} className="bg-teal-500 text-white font-bold px-2 lg:px-5 py-2 rounded-2xl md:rounded-3xl my-auto mr-1 md:mr-4  cursor-pointer transition-color transition-transform delay-50 hover:scale-110 hover:bg-teal-600 ">

                     {location === '/' ? 'Dashboard' : 'Home'}
  
                 </button>
          
                
              
          
     </div>
  )
}

export default Header