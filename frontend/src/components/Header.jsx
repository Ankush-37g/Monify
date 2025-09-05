import React from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { assets } from "../assets/assets";
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import api from '../utils/Api.js';
import { toast } from 'react-toastify';


const Header = () => {

  const {navigate,visible,setVisible,user,setUser} = useContext(UserContext)

  const handleLogout = async() => {

       try {
          const response = await api.post('/user/logout');

          console.log(response.data)

          if(response.data.success)
          {
              navigate('/login')

              setUser("")

              localStorage.removeItem("user")
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

     <div className="fixed top-0 left-0 right-0 z-50  h-18 flex justify-between backdrop-blur-lg  bg-gray-950">
    
                <div className="flex items-center ml-2">
    
                  {
                    visible ? <RxCross2 onClick={()=>setVisible(false)} className={`md:hidden w-10 h-10  text-teal-500 bg-black cursor-pointer `} /> 
    
                    : <IoMenuOutline onClick={()=>setVisible(true)}
                    className={`md:hidden block w-15 h-12  text-teal-500 bg-gray-950 cursor-pointer `}/>
    
                  }
                
                 <div className='hidden md:flex items-center gap-2 ml-10'>
                     <img className="hidden md:block w-10 " src={assets.logo3} alt="logo" />
                     <p className='text-gray-200 text-4xl font-bold'>Monify</p>
                 </div>
                  
                  
                </div>
    
                <p className="md:hidden text-white font-bold text-3xl my-auto">Monify</p>
    
                
               <button onClick={()=> localStorage.getItem("user") ? handleLogout() : navigate('/login')} className="bg-teal-500 text-white font-bold px-3 lg:px-5 py-2 rounded-2xl md:rounded-3xl my-auto mr-4  cursor-pointer transition-color transition-transform delay-50 hover:scale-110 hover:bg-teal-600 ">

                       {localStorage.getItem("user")? "Logout" : "Login"} 

                </button>
                
              
          
     </div>
  )
}

export default Header