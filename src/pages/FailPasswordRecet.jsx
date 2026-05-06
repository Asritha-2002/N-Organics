import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FailPasswordRecet = () => {
  const navigate = useNavigate();

  return (
    <div  className="min-h-screen flex items-center justify-center bg-cover bg-center">
      
      <div className="text-center bg-[#ffffff] w-[350px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#457358] shadow-lg">
        
        <div className="bg-[#457358] rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <FaTimes className="text-white text-2xl" />
        </div>

        <p className="text-gray-700 mb-6">Token Expired</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/forget-password")}
            className="bg-[#002b0a] hover:bg-[#457358] text-white px-20 py-2 rounded-lg cursor-pointer"
          >
            Forget Password
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="border border-[#002b0a] text-[#002b0a] px-20 py-2 rounded-lg hover:bg-[#457358] hover:text-white cursor-pointer"
          >
            Sign In
          </button>
        </div>

      </div>

    </div>
  );
};

export default FailPasswordRecet;