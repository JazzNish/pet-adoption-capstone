import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaCommentDots, FaSpinner, FaHistory } from 'react-icons/fa';
import { LuClipboardList } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    // --- FETCH REAL DATA FROM BACKEND ---
    // --- FETCH REAL DATA & AUTO-REFRESH ---
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('pet-adoption-capstone.vercel.app/api/applications/my-applications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    
                    // 🚨 DEBUG LOG: Let's see exactly what the database is sending!
                    console.log("RAW DATABASE APPLICATIONS:", data);
                    
                    // Safely filter only if data is actually an array
                    if (Array.isArray(data)) {
                        setApplications(data.filter(app => app.pet != null));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            }
        };

        // 1. Fetch immediately on load, then turn off the loading spinner
        fetchApplications().then(() => setIsLoading(false));

        // 2. Silently fetch fresh data every 5 seconds in the background
        const intervalId = setInterval(() => {
            fetchApplications();
        }, 5000);

        // 3. Cleanup: Stop asking the server when the user leaves the page
        return () => clearInterval(intervalId);
        
    }, [token]);

    // Helper function to color the status badges perfectly
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Cancelled': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Calculate dynamic stats for the top cards!
    const activeCount = applications.filter(app => app.status === 'Pending').length;
    const approvedCount = applications.filter(app => app.status === 'Approved').length;
    const totalHistory = applications.length;

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin size-12 text-[#1c1e21]" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfdfd] py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-6xl mx-auto">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[#1c1e21]">My Applications</h1>
                        <p className="text-gray-500 font-medium mt-1">Track the status of your adoption requests.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors bg-white shadow-sm">
                        <FaFilter className="text-gray-400" /> Filter
                    </button>
                </div>

                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Card 1: Active */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">Active Applications</p>
                            <h3 className="text-3xl font-black text-[#1c1e21]">{activeCount}</h3>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <LuClipboardList className="size-6 text-blue-500" />
                        </div>
                    </div>

                    {/* Card 2: Approved */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">Approved</p>
                            <h3 className="text-3xl font-black text-[#1c1e21]">{approvedCount}</h3>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <FiCheckCircle className="size-6 text-green-500" />
                        </div>
                    </div>

                    {/* Card 3: Past History */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">Past History</p>
                            <h3 className="text-3xl font-black text-[#1c1e21]">{totalHistory}</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <FaHistory className="size-6 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* --- TABLE --- */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <LuClipboardList className="size-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-[#1c1e21]">No applications yet!</h2>
                        <p className="text-gray-500 font-medium mt-2">When you apply to adopt a pet, your request will appear here.</p>
                        <Link to="/browse-pets" className="mt-6 bg-[#1c1e21] hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors">
                            Find a Pet
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider font-bold">
                                    <th className="px-6 py-5">Pet Name</th>
                                    <th className="px-6 py-5">Date Applied</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                        
                                        {/* Pet Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={app.pet?.imageUrl} alt={app.pet?.name} className="size-12 rounded-full object-cover border border-gray-200" />
                                                <div>
                                                    <h4 className="font-bold text-[#1c1e21] text-base">{app.pet?.name}</h4>
                                                    <p className="text-sm text-gray-500 font-medium">{app.pet?.breed}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-sm font-semibold text-[#1c1e21]">
                                            {new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(app.status)}`}>
                                                <span className="size-1.5 rounded-full bg-current opacity-75"></span>
                                                {app.status}
                                            </span>
                                        </td>

                                        {/* Dynamic Action Button */}
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'Approved' ? (
                                                <Link 
                                                    to={`/chat/${app.pet?._id}/${app.rehomer}`} 
                                                    className="inline-flex items-center gap-2 bg-[#1c1e21] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                                                >
                                                    <FaCommentDots /> Chat
                                                </Link>
                                            ) : (
                                                <button disabled className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed">
                                                    Reviewing...
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}