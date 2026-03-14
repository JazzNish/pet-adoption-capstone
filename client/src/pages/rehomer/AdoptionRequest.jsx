import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';

export default function AdoptionRequest() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('https://pet-adoption-capstone.onrender.com/api/applications/rehomer', { // 👈 FIXED ROUTE HERE!
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    
                    if (Array.isArray(data)) {
                        // Again, let's remove the strict filter for a second so we can see the data
                        setRequests(data); 
                    }
                }
            } catch (error) {
                console.error("Failed to load requests:", error);
            }
        };

        fetchRequests().then(() => setIsLoading(false));
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
    }, [token]);

    // Function to handle clicking Approve or Reject
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/applications/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Instantly update the screen without refreshing the page!
                setRequests(requests.map(req => 
                    req._id === id ? { ...req, status: newStatus } : req
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update application status.");
        }
    };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-[#1c1e21]" /></div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfdfd] py-10 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#1c1e21]">Adoption Requests</h1>
                    <p className="text-gray-500 font-medium mt-1">Review the applications from people who want to adopt your pets.</p>
                </div>

                {/* Requests List */}
                {requests.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 py-24 flex flex-col items-center justify-center text-center shadow-sm">
                        <FaInbox className="size-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-[#1c1e21]">No requests yet!</h2>
                        <p className="text-gray-500 font-medium mt-2 max-w-sm">When an adopter fills out an application for one of your pets, it will appear here for your review.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div key={req._id} className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8">
                                
                                {/* Top Section: Adopter & Pet Info */}
                                <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img src={req.adopter?.profilePicture || "/src/assets/noUser.png"} alt="Adopter" className="size-14 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                                        <div>
                                            <h3 className="font-bold text-[#1c1e21] text-lg">{req.adopter?.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{req.adopter?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Applying for</p>
                                            <p className="font-bold text-[#1c1e21]">{req.pet?.name}</p>
                                        </div>
                                        <img src={req.pet?.imageUrl} alt="Pet" className="size-10 rounded-xl object-cover" />
                                    </div>
                                </div>

                              {/* Middle Section: Application Answers */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    {/* Small Info Badges */}
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Contact Number</p>
                                            <p className="font-bold text-[#1c1e21] bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">{req.contactNumber || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Monthly Salary</p>
                                            <p className="font-bold text-green-700 bg-green-50 inline-block px-3 py-1 rounded-lg border border-green-100">₱ {req.salary?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Living Situation</p>
                                            <p className="font-bold text-[#1c1e21] bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">{req.livingSituation}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Other Pets at Home</p>
                                            <p className="font-bold text-[#1c1e21] bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">{req.otherPets || 'None'}</p>
                                        </div>
                                    </div>

                                    {/* Big Text Areas */}
                                    <div className="sm:col-span-2 mt-2">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Why they want to adopt</p>
                                        <p className="text-[#1c1e21] bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100 italic">"{req.reason || 'No reason provided.'}"</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pet Experience & Routine</p>
                                        <p className="text-[#1c1e21] bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100">{req.experience}</p>
                                    </div>
                                </div>

                                {/* Bottom Section: Actions / Status */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm text-gray-400 font-medium">Applied {new Date(req.createdAt).toLocaleDateString()}</span>
                                    
                                    {req.status === 'Pending' ? (
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors border border-red-100"
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(req._id, 'Approved')}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1e21] text-white font-bold hover:bg-black transition-colors shadow-sm"
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {req.status === 'Approved' ? <FaCheck /> : <FaTimes />} {req.status}
                                        </span>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}