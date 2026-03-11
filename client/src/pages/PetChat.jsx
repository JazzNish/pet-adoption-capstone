import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function PetChat() {
    const { petId, otherUserId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem('furever_user'));
    const token = localStorage.getItem('token');

    // --- STATE ---
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [pet, setPet] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // This reference helps us automatically scroll to the bottom of the chat!
    const messagesEndRef = useRef(null);

    // --- FETCH DATA & AUTO-REFRESH ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Fetch Pet & User Details (Only needs to happen once)
                const petRes = await fetch(`http://localhost:5000/api/pets/${petId}`);
                if (petRes.ok) setPet(await petRes.json());

                const userRes = await fetch(`http://localhost:5000/api/users/${otherUserId}/public`);
                if (userRes.ok) setOtherUser(await userRes.json());

                // Fetch initial messages and turn off the loading spinner
                await fetchMessages();
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load chat details:", error);
                setIsLoading(false);
            }
        };

        // This is the function that actually grabs the latest messages
        const fetchMessages = async () => {
            try {
                const chatRes = await fetch(`http://localhost:5000/api/messages/${petId}/${otherUserId}`, {
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

        // 1. Run the initial fetch when the page loads
        fetchInitialData();

        // 2. 🚨 THE MAGIC: Set a timer to fetch new messages every 3 seconds!
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 3000);

        // 3. CLEANUP: Stop the timer when the user leaves the chat page!
        return () => clearInterval(intervalId);
        
    }, [petId, otherUserId, token]);

    // --- SEND MESSAGE ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            petId,
            receiverId: otherUserId,
            text: inputText
        };

        try {
            const res = await fetch('http://localhost:5000/api/messages/send', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(messageData)
            });

            if (res.ok) {
                const newMsg = await res.json();
                // Add the new message to our screen instantly!
                setMessages((prev) => [...prev, newMsg]);
                setInputText(""); // Clear the input box
            }
        } catch (error) {
            console.error("Failed to send:", error);
            alert("Message failed to send.");
        }
    };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin size-12 text-star" /></div>;

    return (
        <div className="max-w-3xl mx-auto min-h-[calc(100vh-80px)] flex flex-col bg-white shadow-sm border-x border-gray-200 animate-[fade-in-up_0.3s_ease-out]">
            
            {/* --- CHAT HEADER --- */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="text-gray-400 hover:text-title transition-colors">
                        <FaArrowLeft className="size-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <img src={otherUser?.profilePicture || "/src/assets/noUser.png"} alt={otherUser?.name} className="size-10 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                        <div>
                            <h2 className="font-bold text-title leading-tight">{otherUser?.name || "Member"}</h2>
                            <p className="text-xs text-subtitle font-medium">Inquiry about <span className="text-star font-bold">{pet?.name}</span></p>
                        </div>
                    </div>
                </div>
                {/* Mini Pet Preview */}
                <Link to={`/pet-details/${petId}`} className="hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl border border-gray-200 transition-colors">
                    <img src={pet?.imageUrl} alt={pet?.name} className="size-8 rounded-lg object-cover" />
                    <span className="text-xs font-bold text-title px-1">View Pet</span>
                </Link>
            </div>

            {/* --- MESSAGES AREA --- */}
            <div className="flex-1 overflow-y-auto p-6 bg-cover/30 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                        <img src={pet?.imageUrl} alt="Pet" className="size-24 rounded-full object-cover shadow-sm mb-4 border-4 border-white" />
                        <h3 className="font-bold text-title text-lg">Start the conversation!</h3>
                        <p className="text-sm text-subtitle max-w-xs mt-1">Send a message to ask about {pet?.name}'s personality, habits, or adoption requirements.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender === currentUser.id;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm font-medium ${
                                    isMe 
                                    ? 'bg-button text-white rounded-tr-sm' 
                                    : 'bg-white text-title border border-gray-200/60 rounded-tl-sm'
                                }`}>
                                    {msg.text}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Invisible div to scroll to! */}
                <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
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