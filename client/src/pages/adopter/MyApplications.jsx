import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaSpinner, FaHistory, FaTrash, FaChevronDown, FaCommentDots } from 'react-icons/fa';
import { LuClipboardList } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All'); 
    const token = localStorage.getItem('token');

    // --- FETCH REAL DATA & AUTO-REFRESH ---
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('https://pet-adoption-capstone.onrender.com/api/applications/adopter', { 
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setApplications(data); 
                    }
                }
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            }
        };

        fetchApplications().then(() => setIsLoading(false));
        const intervalId = setInterval(fetchApplications, 5000);
        return () => clearInterval(intervalId);
    }, [token]);

    // --- DELETE APPLICATION LOGIC ---
    const handleDelete = async (applicationId) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this application?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/applications/${applicationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Instantly remove it from the screen without waiting for the next refresh
                setApplications(prev => prev.filter(app => app._id !== applicationId));
            } else {
                alert("Failed to delete the application.");
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            alert("An error occurred while deleting.");
        }
    };

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

    // Apply the dropdown filter
    const displayedApplications = applications.filter(app => 
        filterStatus === 'All' ? true : app.status === filterStatus
    );

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
                    
                    {/* FILTER DROPDOWN */}
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-[#1c1e21] font-bold bg-white hover:bg-gray-50 outline-none focus:border-orange-500 transition-colors shadow-sm cursor-pointer min-w-[200px]"
                        >
                            <option value="All">All Applications</option>
                            <option value="Pending">Pending Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-3 pointer-events-none" />
                    </div>
                </div>

                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">Active Applications</p>
                            <h3 className="text-3xl font-black text-[#1c1e21]">{activeCount}</h3>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <LuClipboardList className="size-6 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-bold mb-1">Approved</p>
                            <h3 className="text-3xl font-black text-[#1c1e21]">{approvedCount}</h3>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <FiCheckCircle className="size-6 text-green-500" />
                        </div>
                    </div>

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
                {displayedApplications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <LuClipboardList className="size-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-[#1c1e21]">No applications found.</h2>
                        <p className="text-gray-500 font-medium mt-2">There are no applications matching your current filter.</p>
                        {filterStatus !== 'All' && (
                            <button onClick={() => setFilterStatus('All')} className="mt-4 text-orange-500 font-bold hover:underline">
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider font-bold bg-gray-50/50">
                                    <th className="px-6 py-5">Pet Name</th>
                                    <th className="px-6 py-5">Date Applied</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayedApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                                        
                                        {/* Pet Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={app.petId?.imageUrls?.[0] || app.petId?.imageUrl || "https://via.placeholder.com/150"} 
                                                    alt={app.petId?.name || "Deleted Pet"} 
                                                    className="size-12 rounded-full object-cover border border-gray-200 bg-gray-100" 
                                                />
                                                <div>
                                                    <h4 className="font-bold text-[#1c1e21] text-base">{app.petId?.name || "Deleted Pet"}</h4>
                                                    <p className="text-sm text-gray-500 font-medium">{app.petId?.breed || "Unknown"}</p>
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

                                        {/* ACTIONS (Chat/Reviewing + Delete) */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Chat or Reviewing Button */}
                                                {app.status === 'Approved' && app.petId ? (
                                                    <Link 
                                                        to={`/chat/${app.petId?._id}/${app.rehomerId || app.rehomer}`} 
                                                        className="inline-flex items-center gap-2 bg-[#1c1e21] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                                                    >
                                                        <FaCommentDots /> Chat
                                                    </Link>
                                                ) : (
                                                    <button disabled className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed">
                                                        Reviewing...
                                                    </button>
                                                )}

                                                {/* Delete Button */}
                                                <button 
                                                    onClick={() => handleDelete(app._id)}
                                                    className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 size-10 rounded-xl transition-colors shadow-sm"
                                                    title="Delete Application"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
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