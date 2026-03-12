import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

export default function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // --- POPOVER STATE & REFS ---
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef(null);

   // Safely parse the user and block the "undefined" phantom data
    const user = localStorage.getItem('furever_user');
    const userInfo = (user && user !== "undefined") ? JSON.parse(user) : null;

    console.log("NAVBAR SEES THIS USER:", userInfo);

    // --- HANDLERS ---
    const handleLogout = () => {
        // REMOVE BOTH THE USER AND THE TOKEN
        localStorage.removeItem("furever_user");
        localStorage.removeItem("token"); 
        setIsPopoverOpen(false);
        navigate('/'); // Redirect to home after logout
    };

    const handleHomeClick = (e) => {
        // If we are already on the homepage (logged out)
        if (location.pathname === "/" && !userInfo) {
            e.preventDefault(); 
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        }
        // If we are already on the member homepage (logged in)
        if (location.pathname === "/browse-pets" && userInfo) {
            e.preventDefault(); 
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        }
    };

    const handleAbout = (e) => {
        e.preventDefault(); 
        if (location.pathname === "/") {
            const element = document.getElementById("about");
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 10);
            }
        } else {
            navigate("/#about");
        }
    };

    // Close the popover if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex px-6 py-2 bg-white justify-between items-center mx-10 mt-2 rounded-full border border-gray-300 shadow-sm sticky top-2 z-50">

            {/* --- 1. THE SMART LOGO --- */}
            {/* If logged in, go to browse-pets. If logged out, go to home! */}
            <Link to={userInfo ? '/browse-pets' : '/'} onClick={handleHomeClick} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <img src="public/FurEver.png" alt="FurEver Logo" className="h-7"/>
                <div className="flex items-center ml-2">
                    <h1 className="text-lg font-semibold text-title">FurEver</h1>
                </div>
            </Link>

            {/* --- 2. DYNAMIC CENTER LINKS --- */}
            <div className="flex gap-6 items-center text-link font-medium">
                
                {/* PUBLIC LINKS */}
                {!userInfo && (
                    <>
                        <Link to="/" onClick={handleHomeClick} className="hover:opacity-40 duration-300">Home</Link>
                        <Link to="/browse-pets" className="hover:opacity-40 duration-300">Browse Pets</Link>
                        <a href="/#about" onClick={handleAbout} className="hover:opacity-40 duration-300 cursor-pointer">About</a>
                    </>
                )}

                {/* ADMIN LINKS (Only visible to you!) */}
                {userInfo?.role === 'admin' && (
                    <>
                        <Link to="/admin" className="text-red-600 font-bold hover:opacity-70 duration-300 flex items-center gap-1">
                            Admin Panel
                        </Link>
                    </>
                )}

                {/* ADOPTER LINKS */}
                {userInfo?.role === 'adopter' && (
                    <>
                        <Link to="/browse-pets" className="hover:opacity-40 duration-300">Browse Pets</Link>
                        <Link to="/my-applications" className="hover:opacity-40 duration-300">My Applications</Link>
                        <Link onClick={() => setIsPopoverOpen(false)} to="/messages" className="px-3 py-2 text-sm font-medium text-subtitle hover:text-title hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2">
                            Messages
                        </Link>
                        <Link to="saved-pets">Saved Pets</Link>
                    </>
                )}

                {/* REHOMER LINKS */}
                {userInfo?.role === 'rehomer' && (
                    <>
                        <Link to="/my-pets" className="hover:opacity-40 duration-300">My Pets</Link>
                        <Link to="/adoption-requests" className="hover:opacity-40 duration-300">Adoption Requests</Link>
                        <Link onClick={() => setIsPopoverOpen(false)} to="/messages" className="px-3 py-2 text-sm font-medium text-subtitle hover:text-title hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2">
                             Messages
                        </Link>
                    </>
                )}
            </div>


            {/* --- 3. RIGHT SIDE BUTTONS / PROFILE --- */}
            <div className="flex gap-4 items-center">

                {/* PUBLIC BUTTONS */}
                {!userInfo && (
                    <div className="flex gap-6 items-center cursor-pointer">
                        <Link to='/create-account' className="text-sm hover:opacity-40 duration-300 font-semibold text-link">Sign Up</Link>
                        <Link to='/log-in' className="text-sm bg-button text-white px-5 py-2 rounded-full hover:bg-hovered-button duration-300 font-semibold shadow-sm">Login</Link>
                    </div>
                )}

                {/* MEMBER PROFILE ICONS */}
                {userInfo && (
                    <>
                        {/* Notifications */}
                        <div className="text-title flex">
                            <span className="hover:bg-gray-100 duration-300 p-2 rounded-full cursor-pointer relative">
                                <FaBell className="size-4"/>
                            </span>
                        </div>

                        {/* PROFILE POPOVER */}
                        <div className="relative" ref={popoverRef}>
                            
                            {/* Profile Image Trigger */}
                            <div 
                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                className="rounded-full overflow-hidden cursor-pointer hover:brightness-90 duration-300 ring-2 ring-transparent hover:ring-gray-200"
                            >
                                {/* 👈 Dynamically check for their profile picture, otherwise use the default! */}
                                <img 
                                    src={userInfo.profilePicture || "/src/assets/noUser.png"} 
                                    alt="photo" 
                                    className="size-8 object-cover" 
                                    referrerPolicy="no-referrer" // 👈 Add this so Google doesn't block the image!
                                />
                            </div>

                            {/* Popover Card */}
                            {isPopoverOpen && (
                                <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 animate-[fade-in-down_0.2s_ease-out]">
                                    
                                    {/* The little "Arrow" pointing up */}
                                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                                    {/* Popover Content */}
                                    <div className="relative z-10 p-2 flex flex-col">
                                        
                                        {/* User Info Header */}
                                        <Link to="/my-profile" className="px-3 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-sm font-semibold text-title">My Profile ({userInfo.name})</p>
                                            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                        </Link>

                                        <Link onClick={() => setIsPopoverOpen(false)} to="/profile-settings" className="px-3 py-2 border-b border-gray-50 mb-1 text-sm font-semibold text-title truncate hover:opacity-50 transition-opacity">
                                            Profile Settings
                                        </Link>

                                        <Link onClick={() => setIsPopoverOpen(false)} to="/help" className="px-3 py-2 border-b border-gray-50 mb-1 text-sm font-semibold text-title truncate hover:opacity-50 transition-opacity">
                                            Help & Support
                                        </Link>

                                        {/* Sign Out Button */}
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 text-left transition-colors mt-1"
                                        >
                                            <FaSignOutAlt className="size-4" /> 
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

        </nav>
    );
}