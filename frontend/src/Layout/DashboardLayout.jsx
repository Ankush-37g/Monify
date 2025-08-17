
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoMenuOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import {useContext, useState} from "react";
import { UserContext } from "../context/UserContext";


export default function DashboardLayout() {

  const {navigate,token} = useContext(UserContext)

  const [visible, setVisible] = useState(false)

  return (


   <div className="flex flex-col min-h-screen bg-gray-300">

      {/* Header */}
       <div className="fixed top-0 left-0 right-0 z-50  h-12 flex justify-between  bg-black ">

            <div className="flex items-center ml-1">

              {
                visible ? <RxCross2 onClick={()=>setVisible(false)} className={`md:hidden w-7 h-7  text-white bg-black cursor-pointer `} /> 

                : <IoMenuOutline onClick={()=>setVisible(true)}
                className={`md:hidden block w-7 h-7  text-white bg-black cursor-pointer `}/>

              }

              

              <img className="hidden md:block w-33 " src={assets.logo3} alt="logo" />
              
            </div>

            <p className="md:hidden text-white font-bold text-3xl">Monify</p>

            <div>
                <button onClick={()=>navigate('/login')} className="bg-gray-100 text-black font-bold px-2 py-1 rounded-xl mr-2 my-1 md:px-4 mt-2 cursor-pointer  ">
                    Logout
                </button>
            </div>
          
      
       </div>

       {visible && (
        <div className="z-40 w-full bg-white fixed top-10 h-screen ">
          <Sidebar />
        </div>
       )}

      <div className="flex pt-12 md:w-full">

          <div className={`hidden md:block  text-white fixed top-12 left-0  h-screen w-64 `}>
            <Sidebar />
          </div>

          <main className="flex-1 p-6 bg-gray-200 sm:ml-64 ">
            <Outlet />
          </main>
      
      </div>

      
   </div>


  );
}
