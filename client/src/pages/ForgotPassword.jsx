import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaArrowLeft, FaEnvelopeCircleCheck } from 'react-icons/fa6';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally call your backend API to send the email
    console.log("Reset link sent to:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-sans p-4">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#495057]"></div>

        <div className="flex flex-col items-center text-center mb-8 mt-4">
          <FaPaw className="text-title text-4xl mb-4" />
          <h1 className="text-2xl font-bold text-[#1A202C] mb-2">Forgot your password?</h1>
          
          {!isSubmitted ? (
            <p className="text-gray-500 text-sm">
              Enter your registered email and we’ll send you a reset link.
            </p>
          ) : (
            <p className="text-[#10B981] text-sm font-semibold">
              Check your inbox!
            </p>
          )}
        </div>

        {!isSubmitted ? (
          /* --- THE FORM --- */
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-sub-title block mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" 
                className="w-full border-b border-gray-300 p-3 outline-none transition" 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-title hover:bg-hovered-button text-white font-bold py-3.5 rounded-xl duration-400 hover:shadow-lg cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          /* --- SUCCESS STATE --- */
          <div className="flex flex-col items-center animate-fadeIn text-center mb-4">
            <FaEnvelopeCircleCheck className="text-6xl text-green-100 bg-[#10B981] rounded-full p-3 mb-4" />
            <p className="text-gray-600 text-sm mb-6">
              We've sent a password reset link to <br/><span className="font-bold text-gray-800">{email}</span>.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-[#10B981] font-semibold text-sm hover:underline"
            >
              Didn't receive it? Try again.
            </button>
          </div>
        )}

        {/* --- BACK TO LOGIN --- */}
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link to="/log-in" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors">
            <FaArrowLeft /> Back to Sign In
          </Link>
        </div>

      </div>
      
    </div>
  );
}

export default ForgotPassword;