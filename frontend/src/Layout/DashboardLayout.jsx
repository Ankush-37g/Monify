
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

import {useContext, useState} from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";


export default function DashboardLayout() {

  const {visible ,setVisible}  = useContext(UserContext)

  return (


   <div className="flex flex-col min-h-screen bg-gray-300">

      {/* Header */}
      <Header/>

      
      {visible && (
        <div className="z-40 w-full bg-white fixed top-10 h-screen ">
          <Sidebar />
        </div>
      )}

      <div className="flex pt-15 md:w-full">

         
            <div className={`hidden  md:block fixed top-12 left-0  h-screen w-64 `}>
                <Sidebar />
            </div>
        
            <main className="flex-1 p-6  sm:ml-64  bg-gray-800" >
              <Outlet />
            </main>
      
      </div>

      
   </div>


  );
}
