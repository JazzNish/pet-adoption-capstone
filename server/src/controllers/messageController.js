import Message from '../models/Message.js';
import Pet from '../models/Pet.js';

// --- SEND A MESSAGE ---
export const sendMessage = async (req, res) => {
    try {
        const { petId, receiverId, text } = req.body;
        const senderId = req.user.id; // From your authMiddleware

        if (!text) return res.status(400).json({ message: "Message text is required" });

        const newMessage = await Message.create({
            pet: petId,
            sender: senderId,
            receiver: receiverId,
            text
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

// --- GET CONVERSATION FOR A SPECIFIC PET ---
export const getConversation = async (req, res) => {
    try {
        const { petId, otherUserId } = req.params;
        const myId = req.user.id;

        // Find all messages about this pet between these two specific users
        const messages = await Message.find({
            pet: petId,
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort({ createdAt: 1 }); // 1 means oldest to newest (like a normal chat app)

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// --- GET INBOX (ALL ACTIVE CONVERSATIONS) ---
export const getInbox = async (req, res) => {
    try {
        const myId = req.user.id;

        // 1. Find all messages where YOU are the sender OR the receiver
        // We sort by -1 (newest first) and populate the Pet and User details!
        const allMessages = await Message.find({
            $or: [{ sender: myId }, { receiver: myId }]
        })
        .sort({ createdAt: -1 })
        .populate('pet', 'name imageUrl')
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture');

        // 2. Filter them down to unique conversations
        const conversations = [];
        const seenChats = new Set(); // This keeps track of chats we've already added

        allMessages.forEach(msg => {
            // 🚨 SAFETY CHECK: If the sender, receiver, or pet was deleted from the database, skip this message!
            if (!msg.sender || !msg.receiver || !msg.pet) {
                return; // Skips to the next message in the loop safely
            }

            // Figure out who the OTHER person is
            const isMeSender = msg.sender._id.toString() === myId;
            const otherUser = isMeSender ? msg.receiver : msg.sender;

            // Create a unique ID for this specific chat (Pet ID + Other User ID)
            const chatKey = `${msg.pet._id}_${otherUser._id}`;

            // If we haven't seen this chat yet, add it to the inbox list!
            if (!seenChats.has(chatKey)) {
                seenChats.add(chatKey);
                conversations.push({
                    pet: msg.pet,
                    otherUser: otherUser,
                    lastMessage: msg.text,
                    date: msg.createdAt
                });
            }
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching inbox:", error);
        res.status(500).json({ message: "Failed to load inbox" });
    }
};