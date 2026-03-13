import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaBuilding, } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoArrowBackOutline} from 'react-icons/io5';

// 👇 Updated Firebase imports for the Redirect method
import { 
    signInWithRedirect, 
    getRedirectResult, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { googleAuth } from '../service/authService';

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 👇 THE CATCHER: This runs automatically when the page loads.
    // If Google just sent them back, this grabs their profile!
    useEffect(() => {
        const catchGoogleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                
                if (result) {
                    setIsLoading(true);
                    const user = result.user;
                    
                    // Grab the role they picked before they went to Google
                    const savedRole = sessionStorage.getItem("pending_role") || "adopter";

                    const data = await googleAuth({
                        name: user.displayName || "Furever Member", 
                        email: user.email,
                        imageUrl: user.photoURL, 
                        role: savedRole
                    });

                    // Save token and user data locally
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("furever_user", JSON.stringify(data.user));

                    // Clean up the temporary storage
                    sessionStorage.removeItem("pending_role");

                    // Redirect to the correct dashboard
                    if (data.user.role === "admin") navigate("/admin");
                    else if (data.user.role === "adopter") navigate("/browse-pets");
                    else navigate("/my-pets");
                }
            } catch (error) {
                console.error("Google Redirect Error:", error);
                alert("Google sign in failed. Please try again.");
                setIsLoading(false);
            }
        };

        catchGoogleRedirect();
    }, [navigate]);


    const handleRegister = async (e) => {
        e.preventDefault();

        if (!role) {
            alert("Please select account type");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {   
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const fullName = `${firstName.trim()} ${lastName.trim()}`;

            await updateProfile(firebaseUser, { displayName: fullName });

            const data = await googleAuth({
                name: fullName, 
                email: firebaseUser.email,
                imageUrl: "", 
                role: role
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("furever_user", JSON.stringify(data.user));

            if (data.user.role === "admin") navigate("/admin");
            else if (data.user.role === "adopter") navigate("/browse-pets");
            else navigate("/my-pets");

        } catch (error) {
            console.error("Signup Error:", error);
            setIsLoading(false);
            
            if (error.code === 'auth/email-already-in-use') {
                alert("An account with this email already exists. Please head to the Log In page!");
            } else {
                alert("Failed to create account. Please try again.");
            }
        }
    };

    // 👇 Updated Google Login
    const handleGoogleLogin = async () => {
        if (!role) {
            alert("Please select account type first");
            return;
        }
        
        // 1. Save their chosen role so we don't forget it!
        sessionStorage.setItem("pending_role", role);
        
        // 2. Teleport them to Google (No popups involved)
        await signInWithRedirect(auth, provider);
    };

    return (
        <div className="min-h-full flex bg-white animate-[fade-in-up_1s_ease-in-out]">
            {/* --- LEFT COLUMN --- */}
            <div className="hidden lg:flex flex-col w-1/2 relative items-center justify-center p-12 gap-2 overflow-hidden">
                <div className="flex absolute top-10 left-6">
                    <Link to='/' title="Go back to homepage" className="hover:bg-gray-100 hover:text-black duration-400 p-2 rounded-full">
                        <IoArrowBackOutline className="size-8"/>
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
                    <h1 className="text-5xl font-bold text-[#1A202C] mb-6 flex items-center gap-4">
                        Welcome to FurEver
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-10">
                        Join our community and help give pets the loving forever homes they deserve.
                    </p>
                </div>

                <div className='flex flex-col w-full max-w-md'>
                    <label className="text-sm font-bold text-gray-700 mb-3">Choose Account Type:</label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div 
                            onClick={() => setRole('adopter')}
                            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 ${
                                role === 'adopter' 
                                ? 'border-[#343a40] bg-[#e9ecef]'
                                : 'border-gray-200 hover:border-[#343a40]'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-full ${role === 'adopter' ? 'bg-[#495057] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <FaUserAlt className="size-4" />
                                </div>
                                <span className="font-bold text-title">Pet Adopter</span>
                            </div>
                            <p className="text-xs text-subtitle leading-tight">I want to adopt a pet.</p>
                        </div>

                        <div 
                            onClick={() => setRole('rehomer')}
                            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 ${
                                role === 'rehomer' 
                                ? 'border-[#343a40] bg-[#e9ecef]'
                                : 'border-gray-200 hover:border-[#343a40]'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-full ${role === 'rehomer' ? 'bg-[#495057] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <FaBuilding className="size-4" />
                                </div>
                                <span className="font-bold text-title">Pet Rehomer</span>
                            </div>
                            <p className="text-xs text-subtitle leading-tight">I want to rehome a pet</p>
                        </div>
                    </div>
                </div>
            </div>

        
            {/* --- RIGHT COLUMN --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 h-screen overflow-y-auto">
                <div className="w-full max-w-md">
                    <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                        <div className="flex flex-col gap-4">
                            
                            {/* Google Auth */}
                            <div>
                                <div onClick={handleGoogleLogin}  className="flex border border-gray-200 w-full py-3 justify-center items-center gap-2 rounded-xl cursor-pointer hover:bg-gray-50 duration-400 ">
                                    <span><FcGoogle className="size-5"/></span>
                                    <button type="button" className="text-title font-semibold">
                                        Sign up with Google
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full my-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-title text-sm font-medium">Or sign up with email</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                            </div>

                            {/* First Name & Last Name Fields */}
                            <div className="flex gap-4 w-full">
                                <div className="w-1/2">
                                    <label className="text-sm font-semibold text-gray-700 block mb-1">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="John" 
                                        className="w-full border-b border-gray-300 p-2 outline-none focus:border-gray-500 transition-colors" 
                                        required 
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="text-sm font-semibold text-gray-700 block mb-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Doe" 
                                        className="w-full border-b border-gray-300 p-2 outline-none focus:border-gray-500 transition-colors" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="john@example.com" 
                                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-gray-500 transition-colors" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-gray-500 transition-colors" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1">Confirm Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full border-b border-gray-300 p-2 outline-none focus:border-gray-500 transition-colors" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* TERMS & PRIVACY */}
                        <div className="flex items-start gap-3 mt-2">
                            <input type="checkbox" id="terms" className="mt-1 size-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981] cursor-pointer" required />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                I agree to the <Link to="/terms" className="text-link hover:underline font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-link hover:underline font-semibold">Privacy Policy</Link>.
                            </label>
                        </div>

                        {/* CTA BUTTONS */}
                        <div className="flex flex-col gap-4 mt-2">
                            <button disabled={isLoading} type="submit" className="w-full bg-button hover:bg-hovered-button text-white font-semibold py-4 rounded-xl transition-all duration-400 cursor-pointer disabled:opacity-70">
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                            
                            <p className="text-center text-sm text-gray-600 font-medium">
                                Already have an account? <Link to="/log-in" className="text-link hover:underline font-bold">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}