
import {Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './Layout/DashboardLayout'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Income from './pages/Income.jsx';
import Transaction from './pages/Transaction.jsx';
import Budget from './pages/Budget.jsx';
import Report from './pages/Report.jsx'

const App = () => {

  return (

    <div className='bg-[#0f0f1a] h-screen'>
        
           <Routes>

              <Route path="/" element = {<Root />}/>
              <Route path="/login" element = {<Login />}/>

              <Route element={<DashboardLayout/>}>
                 <Route path="/dashboard" element={<Dashboard />} />
                 <Route path="/income" element={<Income />} />
                 <Route path="/transaction" element={<Transaction />} />
                 <Route path="/budget" element={<Budget />} />
                 <Route path="/report" element={<Report />} />
              </Route>
          

           </Routes>
        
    </div>
  )
}

const Root = () => {

   const storedToken = localStorage.getItem('token')

   return storedToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;

}

export default App