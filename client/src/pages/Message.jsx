import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots, FaChevronRight, FaSpinner } from 'react-icons/fa';

export default function Messages() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    // --- FETCH INBOX & AUTO-REFRESH ---
    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const res = await fetch('https://pet-adoption-capstone.onrender.com/api/messages/inbox', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setConversations(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch inbox:", error);
            }
        };

        // 1. Fetch immediately on load, then turn off the loading spinner
        fetchInbox().then(() => setIsLoading(false));

        // 2. Silently fetch fresh messages every 3 seconds!
        const intervalId = setInterval(() => {
            fetchInbox();
        }, 1000);

        // 3. Cleanup: Stop asking the server when the user leaves the inbox
        return () => clearInterval(intervalId);

    }, [token]);

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-star" /></div>;

    return (
        <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="max-w-4xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-title flex items-center gap-3">
                        <FaCommentDots className="text-star" /> My Messages
                    </h1>
                    <p className="text-subtitle font-medium mt-2">Manage your adoption inquiries and conversations here.</p>
                </div>

                {conversations.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <FaCommentDots className="size-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-title">No messages yet!</h2>
                        <p className="text-subtitle font-medium max-w-sm mt-2">When you message a Rehomer about a pet, or someone messages you, it will appear here.</p>
                        <Link to="/browse-pets" className="mt-6 bg-button hover:bg-hovered-button text-white px-6 py-3 rounded-xl font-bold transition-colors">
                            Browse Pets
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-200/60 overflow-hidden">
                        {conversations.map((chat, index) => (
                            <Link 
                                key={index} 
                                to={`/chat/${chat.pet._id}/${chat.otherUser._id}`}
                                className="block p-5 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4 sm:gap-6">
                                    {/* Pet Image (Left) */}
                                    <div className="relative shrink-0">
                                        <img src={chat.pet.imageUrl} alt={chat.pet.name} className="size-16 sm:size-20 rounded-2xl object-cover border border-gray-200" />
                                        {/* Little badge showing who they are talking to */}
                                        <img src={chat.otherUser.profilePicture || "/src/assets/noUser.png"} alt={chat.otherUser.name} className="absolute -bottom-2 -right-2 size-8 rounded-full border-2 border-white shadow-sm object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    
                                    {/* Message Info (Middle) */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-title text-lg truncate">
                                                {chat.otherUser.name} <span className="text-subtitle text-sm font-medium ml-1">about {chat.pet.name}</span>
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {new Date(chat.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-subtitle text-sm truncate font-medium">
                                            {chat.lastMessage}
                                        </p>
                                    </div>

                                    {/* Arrow Icon (Right) */}
                                    <FaChevronRight className="text-gray-300 group-hover:text-star transition-colors shrink-0 hidden sm:block" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}