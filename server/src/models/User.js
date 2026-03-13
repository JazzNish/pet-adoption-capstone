import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['adopter', 'rehomer'], required: true },
    profilePicture: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    savedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
    isBanned: { type: Boolean, default: false },
    idVerificationStatus: { 
        type: String, 
        enum: ['unverified', 'pending', 'verified', 'rejected'], 
        default: 'unverified',
    },
    idDocumentUrl: { type: String },
    idType: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);