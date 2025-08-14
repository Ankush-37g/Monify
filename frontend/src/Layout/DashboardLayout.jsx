// layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {

  return (

   <div className="flex min-h-screen">

      <div className="w-64 bg-gray-800 text-white sticky top-0 h-screen">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
      
   </div>


  );
}
