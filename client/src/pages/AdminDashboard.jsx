import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaIdCard, FaSpinner } from 'react-icons/fa';

export default function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users/admin/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPendingUsers(data);
            }
        } catch (error) {
            console.error("Failed to load pending users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/api/users/admin/${action}/${userId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Instantly remove the user from the screen!
                setPendingUsers(pendingUsers.filter(user => user._id !== userId));
                alert(`User successfully ${action}ed!`);
            } else {
                alert(`Failed to ${action} user.`);
            }
        } catch (error) {
            console.error(error);
            alert("Network error.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-cover">
                <FaSpinner className="animate-spin size-12 text-star" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover py-12 px-6 lg:px-12 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-6xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-title flex items-center gap-3">
                        <FaIdCard className="text-star" /> Verification Center
                    </h1>
                    <p className="text-subtitle font-medium mt-2">Review uploaded government IDs to ensure community safety.</p>
                </div>

                {pendingUsers.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <FaCheckCircle className="size-16 text-green-400 mb-4" />
                        <h2 className="text-2xl font-bold text-title">All Caught Up!</h2>
                        <p className="text-subtitle font-medium">There are no pending verifications in the queue.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingUsers.map(user => (
                            <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden flex flex-col">
                                {/* The ID Image - Clicking it opens it full size in a new tab! */}
                                <a href={user.idDocumentUrl} target="_blank" rel="noopener noreferrer" className="h-48 bg-gray-100 block cursor-zoom-in border-b border-gray-200 group relative">
                                    <img src={user.idDocumentUrl} alt="ID Document" className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-sm tracking-wider uppercase">View Full Size</span>
                                    </div>
                                </a>
                                
                                {/* User Info */}
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-title text-lg truncate">{user.name}</h3>
                                        <span className="bg-cover text-star text-[10px] uppercase font-black px-2 py-1 rounded-md">{user.role}</span>
                                    </div>
                                    <p className="text-sm text-subtitle truncate mb-1">{user.email}</p>
                                    <p className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                                    <button 
                                        onClick={() => handleAction(user._id, 'approve')}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                                    >
                                        <FaCheckCircle /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(user._id, 'reject')}
                                        className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                                    >
                                        <FaTimesCircle /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}