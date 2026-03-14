import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rehomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Form Data
    contactNumber: { type: String, required: true },
    salary: { type: Number, required: true },
    livingSituation: { type: String, required: true },
    otherPets: { type: String, required: true },
    experience: { type: String, required: true },
    reason: { type: String, required: true },
    
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);