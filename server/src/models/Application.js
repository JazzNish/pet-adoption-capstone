import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    rehomer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    
    salary: { type: Number, required: true },
    livingSituation: { type: String, required: true },
    experience: { type: String, required: true },
    
    // 👇 MAKE SURE THESE 3 LINES ARE HERE!
    reason: { type: String, required: true },
    otherPets: { type: String, required: true },
    contactNumber: { type: String, required: true }

}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);