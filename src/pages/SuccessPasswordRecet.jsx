import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock } from "lucide-react";

const SuccessPasswordRecet = () => {
    
    const navigate = useNavigate();
  return (
    <div  className="min-h-screen flex items-center justify-center bg-cover bg-center">
    <div className="text-center bg-[#ffffff] w-[300px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#457358]">
              {/* <img src={lock} alt="" /> */}
              <div className='bg-[#457358] rounded-full p-4.5 mb-3'>
                <Lock size={30} className='text-white'/>
              </div>
              <p className="text-gray-700 mb-6">
                Password Changed successfully.
              </p>
              <button
                onClick={() => navigate("/sign-in")}
                className="bg-[#002b0a] hover:bg-[#457358] text-white px-20 py-2 rounded-lg cursor-pointer"
              >
                Login
              </button>
            </div>
            </div>
  )
}

export default SuccessPasswordRecet