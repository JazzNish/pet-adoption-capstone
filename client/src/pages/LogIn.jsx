import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBackOutline } from "react-icons/io5";

function LogIn(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Use a direct fetch so we can carefully read the error status!
            const res = await fetch('https://pet-adoption-capstone.onrender.com/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.displayName || "FurEver Member",
                    email: user.email,
                    imageUrl: user.photoURL 
                    // Notice: Still no role! We want the backend to catch new users.
                })
            });

            const data = await res.json();

            // 🚨 Check if the backend blocked them because they are brand new!
            if (!res.ok) {
                if (data.requireSignup) {
                    // <AlertBasic title="Google Sign In" description="It looks like you don't have an account yet! Redirecting you to Sign Up so you can choose your account type." />
                    // navigate("/create-account");
                    alert("It looks like you don't have an account yet! Redirecting you to Sign Up so you can choose your account type." )
                    return; // Stop the login process
                }
                throw new Error(data.message || "Google Login Failed");
            }

            // If successful, save token and user info!
            localStorage.setItem("token", data.token);
            localStorage.setItem("furever_user", JSON.stringify(data.user));

            // Redirect based on their saved role
            if (data.user.role === "admin") {
                navigate("/admin");
            } else if (data.user.role === "adopter") {
                navigate("/browse-pets");
            } else {
                navigate("/my-pets");
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Google Sign In encountered an error. Please try again.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Let Firebase check the email and password securely
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. If Firebase says yes, tell your Render backend to grab their FurEver profile
            const response = await fetch('https://pet-adoption-capstone.onrender.com/api/auth/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: firebaseUser.email }) 
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not find your profile in our database.");
            }

            // 3. Save the token and profile, just like Google Login does!
            localStorage.setItem("token", data.token);
            localStorage.setItem("furever_user", JSON.stringify(data.user));

            // 4. Route them to the right dashboard
            if (data.user.role === "admin") navigate("/admin");
            else if (data.user.role === "adopter") navigate("/browse-pets");
            else navigate("/my-pets");

        } catch (error) {
            console.error("Login Error:", error);
            // Firebase gives specific errors (like wrong password), so we can show them!
            alert(error.message.replace("Firebase: ", "")); 
            setIsLoading(false);
        }
    };

    return(
        <>
        <section className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-80px)] animate-[fade-in-up_1s_ease-in-out]">

            {/* Left Side: Welcome Text */}
            <div className="hidden lg:flex relative flex-col gap-4 px-10 justify-center w-full">
                <div className="flex absolute top-10 left-6">
                    <Link to='/' title="Go back to homepage" className="hover:bg-gray-100 hover:text-black duration-400 p-2 rounded-full transition-colors">
                        <IoArrowBackOutline className="size-8"/>
                    </Link>
                </div>
                <h1 className="text-5xl text-title font-semibold w-full max-w-lg">Welcome back to FurEver!</h1>
                <span className="text-subtitle w-full max-w-md leading-relaxed">
                    We're excited to see you again. Log in to continue your pet adoption journey and reconnect with your furry friends.
                </span>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col gap-6 justify-center items-center p-8">
                
                {/* Mobile Back Button */}
                <div className="flex lg:hidden w-full max-w-sm justify-start mb-4">
                     <Link to='/' className="text-subtitle hover:text-title duration-300">
                        <IoArrowBackOutline className="size-6"/>
                    </Link>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col items-center gap-6 w-full max-w-sm">
                    
                    <div  onClick={handleGoogleLogin} className="flex border border-gray-200 w-full py-3 justify-center items-center gap-2 rounded-xl cursor-pointer hover:bg-gray-50 duration-400 transition-colors">
                        <span>
                            <FcGoogle className="size-5"/>
                        </span>
                        <button type="button" className="text-title font-semibold h-full">
                            Sign in with Google
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor='email' className="text-title font-semibold text-sm">Email address</label>
                            <input 
                                type="email" 
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-b border-gray-300 py-2 outline-none focus:border-gray-500 transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* 👇 NEW Password Input */}
                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor='password' className="text-title font-semibold text-sm">Password</label>
                            <input 
                                type="password" 
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-b border-gray-300 py-2 outline-none focus:border-gray-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <button disabled={isLoading} type="submit" className="flex justify-center w-full bg-button hover:bg-hovered-button duration-400 py-4 rounded-xl text-white font-semibold transition-colors shadow-sm disabled:opacity-70">
                            {isLoading ? "Signing In..." : "Log In"}
                        </button>
                    </div>

                    <div>
                        <span className="text-stone-500 flex gap-1 text-sm">
                            New to the community?
                            <Link to='/create-account' className="text-link font-semibold hover:underline duration-400">
                                Sign Up
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </section>
        </>
    );
}

export default LogIn;