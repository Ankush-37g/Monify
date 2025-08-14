import React, { useState } from 'react';
import { assets } from '../assets/assets';

// This is the main component for the sign-up page.
// It features a two-column layout that is responsive,
// collapsing to a single column on small screens.
const Login = () => {

  const [currentState, setCurrentState] = useState('login')
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // A simple function to handle the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      email,
      password,
      confirmPassword,
    });
    // Here you would typically add form validation and API calls.
  };

  return (
    // Main container for the entire page.
    // It uses flexbox to create the two-column layout on larger screens.
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* Left panel - visible only on medium and larger screens */}
      <div className="hidden md:flex flex-col items-center justify-between p-8 bg-white w-1/2  rounded-r-[40px] shadow-lg">

        <div className="flex flex-col items-start w-full">
          {/* Using a simple div for the logo text */}
          <div className="flex items-center space-x-2 mb-2">

            <div className="w-8 h-8 rounded-full bg-green-500"></div>
            <span className="text-xl font-bold text-gray-800">Monify, Inc.</span>

          </div>

          <p className="text-sm text-gray-500">123 Anywhere St., Kerala</p>

        </div>
      
        {/* Placeholder for the 3D illustration */}
        <div className="flex-grow flex items-center justify-center">
          <img
            src={assets.logo2}
            alt="Person working at a desk"
            className="object-contain"
          />
        </div>
        
        <div className="w-full text-center text-gray-400 text-sm mt-auto">
          &copy; 2025 Monify, Inc. All rights reserved.
        </div>

      </div>

      {/* Right panel - the main sign-up form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-3/5 p-4 sm:p-8 bg-gradient-to-br from-green-400 to-green-700 rounded-l-[40px] md:rounded-l-none">

        <div className="w-full max-w-lg p-6 sm:p-10 rounded-3xl backdrop-blur-sm bg-black shadow-xl">

          {/* Form header */}
          <div className="mb-8 text-center text-white">

            { 
              currentState === 'signUp' ? ( <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-md">Create a New Account</h1> )

              : currentState==='login' ?  (<h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-md">Login</h1>)
              
              : <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-md">Reset Password</h1>
            }

          </div>

          {/* Sign-up form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name Input */}
            {
              currentState === 'signUp' ?
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="peer w-full px-4 py-3 bg-white/20 text-white  rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-300"
                    />
                  
                  </div>
                </div>
                : ""
            }
            

            {/* Email Input */}
            { currentState === 'resetPassword' ? " "
               :  
               <div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address "
                      className="peer w-full px-4 py-3 bg-white/20 text-white  rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-300"
                    />
                  
                  </div>
               </div> 
            }

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="peer w-full px-4 py-3 pr-12 bg-white/20 text-white rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-300"
                />
               
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <div>
                <input
                  type='password'
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="peer w-full px-4 py-3 pr-12 bg-white/20 text-white  rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-300"
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 bg-white/90 text-green-700 font-bold text-lg rounded-xl shadow-lg hover:bg-white transition-colors duration-300 transform hover:scale-105"
            >
              {currentState==='login' ? "Login"
               :currentState ==='signUp' ? "Sign Up"
               : "Reset Password"}
            </button>

          </form>

          {/* Log In link */}
          <div className="mt-8 text-center text-white/90">

            { currentState ==='signUp' ? <p>Already have an account? </p> : <p onClick={()=>setCurrentState("resetPassword")} className='cursor-pointer' > Forgot Password? </p>}


            {
              currentState === 'login'
              ?  <p onClick={()=>setCurrentState('signUp')} className="font-bold underline hover:text-white transition-colors cursor-pointer">
                    Sign Up
                 </p>
              :  <p onClick={()=>setCurrentState('login')} className="font-bold underline hover:text-white transition-colors cursor-pointer">
                    Login
                 </p>
            }

           

          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
