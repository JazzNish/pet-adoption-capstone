import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { FiMoreVertical, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'; // 👈 NEW ICONS

export default function PetChat() {
    const { petId, otherUserId } = useParams();
    
    // 🛡️ SAFE USER PARSING: Prevents the white screen crash!
    let currentUser = {};
    try {
        currentUser = JSON.parse(localStorage.getItem('furever_user')) || {};
    } catch (e) {
        currentUser = {};
    }
    const token = localStorage.getItem('token');

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [pet, setPet] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 🚨 NEW STATE FOR THE DROPDOWN MENU
    const [showMenu, setShowMenu] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (petId && petId !== 'undefined') {
                    const petRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/pets/${petId}`);
                    if (petRes.ok) setPet(await petRes.json());
                }

                if (otherUserId && otherUserId !== 'undefined') {
                    const userRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/users/${otherUserId}/public`);
                    if (userRes.ok) setOtherUser(await userRes.json());
                }

                await fetchMessages();
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load chat details:", error);
                setIsLoading(false);
            }
        };

        const fetchMessages = async () => {
            if (!petId || petId === 'undefined' || !otherUserId || otherUserId === 'undefined') return;
            
            try {
                const chatRes = await fetch(`https://pet-adoption-capstone.onrender.com/api/messages/${petId}/${otherUserId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (chatRes.ok) {
                    const newMessages = await chatRes.json();
                    setMessages(newMessages);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchInitialData();
        const intervalId = setInterval(fetchMessages, 3000);
        return () => clearInterval(intervalId);
    }, [petId, otherUserId, token]);

    // --- AUTO SCROLL TO BOTTOM ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            petId,
            receiverId: otherUserId,
            text: inputText 
        };

        try {
            const res = await fetch('https://pet-adoption-capstone.onrender.com/api/messages/send', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(messageData)
            });

            if (res.ok) {
                const newMsg = await res.json();
                setMessages((prev) => [...prev, newMsg]);
                setInputText(""); 
            }
        } catch (error) {
            console.error("Failed to send:", error);
        }
    };

    // 🚨 ACTION: MARK AS ADOPTED 🚨
    const handleMarkAdopted = async () => {
        setShowMenu(false);
        const confirmAdopt = window.confirm(`Are you sure you want to mark ${pet?.name} as Adopted? This will close all applications for this pet.`);
        if (!confirmAdopt) return;

        try {
            const res = await fetch(`https://pet-adoption-capstone.onrender.com/api/pets/${petId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: 'Adopted' })
            });

            if (res.ok) {
                alert(`${pet?.name} has been marked as Adopted! 🎉`);
                // Update local state to hide the button
                setPet(prev => ({ ...prev, status: 'Adopted' }));
            } else {
                alert("Failed to update pet status.");
            }
        } catch (error) {
            console.error("Error marking pet as adopted:", error);
        }
    };

    // 🚨 ACTION: REPORT USER 🚨
    const handleReportUser = () => {
        setShowMenu(false);
        const reason = window.prompt(`Why are you reporting ${otherUser?.name}? (e.g. Inappropriate behavior, spam, scam)`);
        
        if (reason && reason.trim() !== "") {
            // For now, we will just console.log the report, but you can hook this up to your backend later!
            console.log(`REPORT SUBMITTED: User ${otherUserId} reported for: ${reason}`);
            alert(`Thank you. We have received your report regarding ${otherUser?.name}. Our team will review this conversation.`);
        }
    };


    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-star" /></div>;

    // 🛡️ BULLETPROOF IMAGE LOGIC 🛡️
    const rawPetImg = pet?.imageUrls?.[0] || pet?.imageUrl;
    const safePetImg = (rawPetImg && rawPetImg !== 'undefined' && rawPetImg !== 'null') 
        ? rawPetImg 
        : "https://via.placeholder.com/150?text=No+Image";

    const rawUserImg = otherUser?.profilePicture;
    const safeUserImg = (rawUserImg && rawUserImg !== 'undefined' && rawUserImg !== 'null')
        ? rawUserImg
        : "/src/assets/noUser.png";

    // Determine if the current user is the OWNER of this pet
    // (We use optional chaining just in case the data is still loading)
    const amIOwner = pet?.owner === currentUser?._id || pet?.owner?._id === currentUser?._id;

    return (
        <div className="w-[80vw] mx-auto min-h-[calc(100vh-65px)] flex flex-col bg-white shadow-sm border-x border-gray-200 animate-[fade-in-up_0.3s_ease-out]">
            
            {/* --- CHAT HEADER --- */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm relative">
                
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="text-gray-400 hover:text-title transition-colors">
                        <FaArrowLeft className="size-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <img 
                            src={safeUserImg} 
                            alt={otherUser?.name || "User"} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "/src/assets/noUser.png" }}
                            className="size-10 rounded-full object-cover border border-gray-200 bg-gray-50" 
                            referrerPolicy="no-referrer" 
                        />
                        <div>
                            <h2 className="font-bold text-title leading-tight">{otherUser?.name || "Member"}</h2>
                            <p className="text-xs text-subtitle font-medium">Inquiry about <span className="text-star font-bold">{pet?.name || "this pet"}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mini Pet Preview */}
                    <Link to={`/pet-details/${petId}`} className="hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl border border-gray-200 transition-colors">
                        <img 
                            src={safePetImg} 
                            alt={pet?.name || "Pet"} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                            className="size-8 rounded-lg object-cover bg-white" 
                        />
                        <span className="text-xs font-bold text-title px-1">View Pet</span>
                    </Link>

                    {/* 🚨 THE NEW THREE DOTS MENU 🚨 */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowMenu(!showMenu)} 
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiMoreVertical className="size-5" />
                        </button>

                        {/* Dropdown Box */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1 animate-[fade-in-up_0.2s_ease-out]">
                                
                                {/* If you own the pet, you can mark it as adopted */}
                                {amIOwner && pet?.status !== 'Adopted' && (
                                    <button 
                                        onClick={handleMarkAdopted}
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-2 transition-colors border-b border-gray-100"
                                    >
                                        <FiCheckCircle className="size-4" /> Mark as Adopted
                                    </button>
                                )}

                                {/* Everyone can Report the other user */}
                                <button 
                                    onClick={handleReportUser}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <FiAlertTriangle className="size-4" /> Report User
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- MESSAGES AREA --- */}
            {/* Click anywhere on the messages to close the dropdown menu! */}
            <div onClick={() => setShowMenu(false)} className="flex-1 overflow-y-auto p-6 bg-cover/30 space-y-4 cursor-default">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                        <img 
                            src={safePetImg} 
                            alt="Pet" 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                            className="size-24 rounded-full object-cover shadow-sm mb-4 border-4 border-white bg-gray-50" 
                        />
                        <h3 className="font-bold text-title text-lg">Start the conversation!</h3>
                        <p className="text-sm text-subtitle max-w-xs mt-1">Send a message to ask about {pet?.name || "this pet"}'s personality, habits, or adoption requirements.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg?.sender === currentUser?.id || msg?.sender === currentUser?._id;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm font-medium ${
                                    isMe 
                                    ? 'bg-button text-white rounded-tr-sm' 
                                    : 'bg-white text-title border border-gray-200/60 rounded-tl-sm'
                                }`}>
                                    {msg.content || msg.text}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onFocus={() => setShowMenu(false)} // Close menu if they start typing
                        placeholder="Type a message..." 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-star focus:bg-white transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputText.trim()}
                        className="bg-button hover:bg-hovered-button disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-colors flex items-center justify-center shadow-sm"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
            
        </div>
    );
}