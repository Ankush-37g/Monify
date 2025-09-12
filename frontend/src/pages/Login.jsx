import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { UserContext } from '../context/UserContext';
import api from '../utils/Api.js';
import {toast} from "react-toastify"
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {

  

  const [currentState, setCurrentState] = useState('login')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {navigate, setUser, user, setIsLoading} =  useContext(UserContext)

  // A simple function to handle the form submission.
  const handleSubmit = async(e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        if(currentState === "signUp")
        {
          const response = await api.post("/user/signup",{name,email,password})

          // console.log(response.data);

          if(response.data.success)
          {
                 
             toast.success("Account created Successfully")

             setCurrentState("login")

             setName("")
             setEmail("")
             setPassword("")
             
   
          }
        }
        else if(currentState === "login")
        {
            const response = await api.post("/user/login",{email,password})

            console.log(response.data)

            if(response.data.success)
            {
              setUser(response.data.data)

              localStorage.setItem('user',JSON.stringify(response.data.data.user))

              toast.success("Login Successfull")

              navigate('/dashboard')

              setEmail("")
              setPassword("")
              
            }
        }
        else if(currentState === "resetPassword")
        {
            const response = await api.post("/user/resetPassword",{email,password,confirmPassword})

            console.log(response.data)

            if(response.data.success)
            {
              toast.success("Password reset successfully")

              setCurrentState("login")

              setEmail("")
              setPassword("")
              setConfirmPassword("")
            }
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
      } finally {
          setIsLoading(false);
      }
  };

  


  return (
 
    <div className="flex justify-center items-center bg-gray-950 font-sans h-screen">
      
      <div className='flex items-center gap-4 bg-gray-800  rounded-xl' >

          {/* Left panel - visible only on medium and larger screens */}
          <div className="hidden  h-full md:w-1/2 shadow-lg bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl p-8 md:flex flex-col justify-center items-center">
          {/* Using a placeholder for a growth chart to better visualize the app's purpose */}
          <div className="text-center text-white space-y-4 p-">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md mb-4">
              Welcome to Monify!
            </h2>
            <p className='text-xl'>Your Personal Finance Tracker</p>
            <img 
              src={assets.logo}
              alt="A visual representation of financial data" 
              className="rounded-xl shadow-lg w-sm mx-auto"
            />
          </div>
         </div>
         
          {/* right panel */}
          <div className="w-full md:w-1/2 rounded-xl backdrop-blur-sm  px-3 py-3">

              {/* Form header */}
              <div className="mb-8 text-center text-white">

                { 
                  currentState === 'signUp' ? ( <h1 className="text-3xl text-teal-500 sm:text-4xl font-bold mb-2 drop-shadow-md">Create a New Account</h1> )

                  : currentState==='login' ?  (<p className="text-5xl text-teal-500 sm:text-4xl font-bold mb-2 drop-shadow-md">Login</p>)
                  
                  : <h1 className="text-3xl text-teal-500 sm:text-4xl font-bold mb-2 drop-shadow-md">Reset Password</h1>
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
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className="peer w-full px-4 py-3 bg-white/20 text-white  rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-300"
                        />
                      
                      </div>
                    </div>
                    : ""
                }
                

                {/* Email Input */}
                
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
                { currentState !== 'resetPassword' ? " "
                  : 
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
                } 

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-500 text-gray-200 font-bold text-lg rounded-xl shadow-lg hover:bg-teal-400 transition-colors duration-300  cursor-pointer"
                >
                  {currentState==='login' ? "Login"
                  :currentState ==='signUp' ? "Sign Up"
                  : "Reset Password"}
                </button>

              </form>

              <div className='mt-6 flex items-center justify-center '>

                  <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        setIsLoading(true);
                        try {
                          const response = await api.post(
                            "/user/google",
                            {
                              token: credentialResponse.credential,
                            },
                          );

                          console.log(response.data)

                          if (response.data.success) {
                            setUser(response.data.data);
                            localStorage.setItem('user',JSON.stringify(response.data.data.user))
                            toast.success("Login Successful with Google");
                            navigate("/dashboard");
                          } else {
                            toast.error("Google login failed on backend");
                          }
                        } catch (error) {
                          toast.error(error.response?.data?.message || "Google login failed");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      onError={() => {
                        toast.error("Google Login Cancelled/Failed");
                        setIsLoading(false);
                      }}
                 />

              </div>
               

              {/* Log In link */}
              <div className="mt-5 text-center text-white/90">

                { currentState ==='signUp' ? <p>Already have an account? </p> : <p onClick={()=>setCurrentState("resetPassword")} className='cursor-pointer' > Forgot Password? </p>}


                {
                  currentState === 'login'
                  ?  <p onClick={()=> { setCurrentState('signUp') }} className="font-bold underline hover:text-white transition-colors cursor-pointer">
                        Sign Up
                    </p>
                  :  <p onClick={()=>{
                          setCurrentState('login')
                          
                          }} className="font-bold underline hover:text-white transition-colors cursor-pointer">
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
