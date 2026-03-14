import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaIdCard } from "react-icons/fa";

export default function AdminVerifications() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // For zooming in on the ID

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await fetch('https://pet-adoption-capstone.onrender.com/api/users/admin/pending', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPendingUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch pending verifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // 1. Fetch immediately when the page loads
        fetchPending();

        // 👇 2. THE MAGIC: Silently fetch again every 3 seconds!
        const intervalId = setInterval(() => {
            fetchPending();
        }, 3000); 

        // 3. Clean up the timer when we leave the page so it doesn't run forever
        return () => clearInterval(intervalId);
    }, []);

    const handleReview = async (userId, newStatus) => {
        // Decide which word to show in the popup alert
        const displayAction = newStatus === 'Verified' ? 'Approve' : 'Reject';
        if (!window.confirm(`Are you sure you want to ${displayAction} this ID?`)) return;

        // 👇 THE FIX: Decide which backend route to hit based on the button clicked!
        const endpoint = newStatus === 'Verified' ? 'approve' : 'reject';

        try {
            const response = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/admin/${endpoint}/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
                // Notice we removed the body, because your backend controller 
                // already knows what to do based on the URL!
            });

            if (response.ok) {
                // Remove the user from the pending list instantly
                setPendingUsers(pendingUsers.filter(user => user._id !== userId));
                setSelectedImage(null); // Close the image viewer if it was open
                alert(`ID successfully ${displayAction}d!`);
            } else {
                const data = await response.json();
                alert(data.message || `Failed to ${displayAction} ID.`);
            }
        } catch (error) {
            console.error("Error reviewing ID:", error);
            alert("An error occurred while communicating with the server.");
        }
    };

    return (
        <div className="animate-[fade-in-up_0.5s_ease-in-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaIdCard className="text-blue-500" /> Pending ID Verifications
            </h1>

            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading requests...</div>
            ) : pendingUsers.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center text-gray-500">
                    <FaCheck className="size-12 mx-auto text-green-400 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-gray-700">You are all caught up!</h3>
                    <p>There are no pending ID verifications at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingUsers.map(user => (
                        <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            {/* ID Image Preview */}
                            <div 
                                className="h-48 bg-gray-100 cursor-pointer relative group"
                                onClick={() => setSelectedImage(user.idDocumentUrl)}
                            >
                                {user.idDocumentUrl ? (
                                    <img src={user.idDocumentUrl} alt="User ID" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Provided</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold tracking-wider">CLICK TO ZOOM</span>
                                </div>
                            </div>
                            
                            {/* User Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Role</div>
                                <p className="capitalize font-medium text-gray-700 mb-6">{user.role}</p>
                                
                                {/* Action Buttons */}
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleReview(user._id, 'Rejected')}
                                        className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                    <button 
                                        onClick={() => handleReview(user._id, 'Verified')}
                                        className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold transition-colors"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- IMAGE ZOOM MODAL --- */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Zoomed ID" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
                    <button className="absolute top-6 right-6 text-white text-xl font-bold p-4">Close</button>
                </div>
            )}
        </div>
    );
}