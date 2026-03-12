import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { MdOutlineMarkEmailRead } from 'react-icons/md';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Automatically grabs the email they just signed up with from the URL
    const email = searchParams.get("email"); 
    const role = searchParams.get("role");

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        
        if (code.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('https://pet-adoption-capstone.onrender.com/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            
            const data = await response.json();

            // 1. If the backend sent us a token, it was a massive success!
            if (data.token) {
                // Log them in!
                localStorage.setItem("token", data.token);
                localStorage.setItem("furever_user", JSON.stringify(data.user));

                // Send them to the right dashboard
                if (data.user.role === "adopter") {
                    navigate("/browse-pets");
                } else {
                    navigate("/my-pets");
                }
            } 
            // 2. If there is no token, but there is an error message (like "Invalid code")
            else if (data.message) {
                setError(data.message);
            }

        } catch (error) {
            console.error("Verification Fetch Error:", error);
            setError("Network error. Please check if your backend is running.");
        } finally {
            setIsLoading(false);
        }
    };
    

    if (!email) {
        return <div className="p-10 text-center text-title">Error: No email provided. <Link to="/create-account" className="text-link underline">Go back</Link></div>;
    }

    return (
        <section className="flex justify-center items-center h-[calc(100vh-80px)] bg-cover animate-[fade-in-up_0.5s_ease-out]">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full mx-4 border border-gray-100 flex flex-col items-center text-center relative">
                
                <Link to='/create-account' className="absolute top-6 left-6 text-subtitle hover:text-title duration-300 p-2 rounded-full hover:bg-gray-50">
                    <IoArrowBackOutline className="size-6"/>
                </Link>

                <div className="size-16 bg-blue-50 text-button rounded-full flex items-center justify-center mb-6 mt-4 shadow-sm">
                    <MdOutlineMarkEmailRead className="size-8" />
                </div>

                <h1 className="text-3xl font-extrabold text-title mb-2">Check your email</h1>
                <p className="text-subtitle text-sm mb-8 leading-relaxed">
                    We've sent a 6-digit verification code to <br/>
                    <span className="font-bold text-title">{email}</span>
                </p>

                <form onSubmit={handleVerify} className="w-full flex flex-col gap-6">
                    
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <input 
                            type="text" 
                            maxLength="6"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only allows numbers!
                            placeholder="••••••"
                            className="w-full text-center text-4xl font-extrabold tracking-[0.5em] text-title py-4 border border-gray-300 rounded-2xl outline-none focus:border-button focus:ring-2 focus:ring-button/20 transition-all placeholder:text-gray-300"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-button hover:bg-hovered-button text-white font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-70"
                    >
                        {isLoading ? "Verifying..." : "Verify Account"}
                    </button>
                </form>

                <p className="mt-8 text-sm text-subtitle font-medium">
                    Didn't receive the email? <button className="text-link hover:underline font-bold">Click to resend</button>
                </p>

            </div>
        </section>
    );
}

export default VerifyEmail;