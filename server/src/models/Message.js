import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); // This automatically adds createdAt so we can sort by time!

export default mongoose.model('Message', messageSchema);