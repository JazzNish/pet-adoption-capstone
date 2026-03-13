import { useState } from "react";
import { FaUserShield, FaCog, FaBell, FaDatabase } from "react-icons/fa";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    
    // Get the admin details we saved during login
    const adminUser = JSON.parse(localStorage.getItem('furever_user')) || {
        name: "System Admin",
        email: "admin@furever.app",
        role: "admin"
    };

    const handleSavePreferences = (e) => {
        e.preventDefault();
        alert("System preferences updated successfully!");
    };

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaCog className="text-gray-500" /> Platform Settings
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* --- SETTINGS SIDEBAR --- */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab("profile")}
                        className={`p-4 rounded-xl text-left font-bold flex items-center gap-3 transition-colors ${activeTab === "profile" ? 'bg-[#1A202C] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                    >
                        <FaUserShield /> Admin Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab("system")}
                        className={`p-4 rounded-xl text-left font-bold flex items-center gap-3 transition-colors ${activeTab === "system" ? 'bg-[#1A202C] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                    >
                        <FaDatabase /> System Preferences
                    </button>
                    <button 
                        onClick={() => setActiveTab("notifications")}
                        className={`p-4 rounded-xl text-left font-bold flex items-center gap-3 transition-colors ${activeTab === "notifications" ? 'bg-[#1A202C] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                    >
                        <FaBell /> Alert Settings
                    </button>
                </div>

                {/* --- SETTINGS CONTENT AREA --- */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    
                    {/* PROFILE TAB */}
                    {activeTab === "profile" && (
                        <div className="animate-[fade-in_0.3s_ease-in-out]">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Account Details</h2>
                            <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="size-20 bg-[#1A202C] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                                    {adminUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-gray-900">{adminUser.name}</h3>
                                    <p className="text-gray-500 font-medium">{adminUser.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Super Administrator
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-sm">
                                <strong>Security Note:</strong> Because this is the Master Panel account, password and email changes are disabled to prevent accidental lockouts during platform demonstrations.
                            </div>
                        </div>
                    )}

                    {/* SYSTEM PREFERENCES TAB */}
                    {activeTab === "system" && (
                        <div className="animate-[fade-in_0.3s_ease-in-out]">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Control</h2>
                            
                            <form onSubmit={handleSavePreferences} className="flex flex-col gap-6">
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Maintenance Mode</h4>
                                        <p className="text-gray-500 text-sm mt-1">Temporarily block all non-admin logins. Useful during major database updates.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={isMaintenanceMode}
                                            onChange={() => setIsMaintenanceMode(!isMaintenanceMode)}
                                        />
                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-sm font-bold text-gray-700">Platform Analytics Tracker ID</label>
                                    <input type="text" disabled value="UA-FUREVER-2026" className="border border-gray-300 p-3 rounded-xl bg-gray-100 text-gray-500 outline-none cursor-not-allowed" />
                                </div>

                                <button type="submit" className="mt-4 bg-[#1A202C] hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-colors self-start">
                                    Save System Preferences
                                </button>
                            </form>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === "notifications" && (
                        <div className="animate-[fade-in_0.3s_ease-in-out]">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Routing</h2>
                            <p className="text-gray-500 mb-6">Configure which system events trigger an email to the master admin account.</p>
                            
                            <div className="flex flex-col gap-4">
                                {['New User Registrations', 'New Pet Listings', 'ID Verification Requests', 'User Reports & Flags'].map((alert, index) => (
                                    <label key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer" />
                                        <span className="font-bold text-gray-700">{alert}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}