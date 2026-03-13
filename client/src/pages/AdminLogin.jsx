import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to log in.");
            }

            // Save the master token and user profile
            localStorage.setItem("token", data.token);
            localStorage.setItem("furever_user", JSON.stringify(data.user));

            // Teleport straight to the admin dashboard
            navigate("/admin");

        } catch (error) {
            console.error("Admin Login Error:", error);
            alert(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A202C] p-4">
            {/* Absolute Back Button */}
            <div className="absolute top-8 left-8">
                <Link to='/' className="text-gray-400 hover:text-white transition-colors p-2">
                    <IoArrowBackOutline className="size-8"/>
                </Link>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-[fade-in-up_0.5s_ease-in-out]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 text-sm">Authorized personnel only.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Admin Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-b-2 border-gray-200 py-2 outline-none focus:border-[#1A202C] transition-colors"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Master Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-b-2 border-gray-200 py-2 outline-none focus:border-[#1A202C] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        disabled={isLoading} 
                        type="submit" 
                        className="w-full mt-4 bg-[#1A202C] hover:bg-black text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-70"
                    >
                        {isLoading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;