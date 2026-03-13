import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    ageUnit: { type: String, enum: ['Months', 'Years'], default: 'Years' }, 
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    weight: { type: Number, required: true },
    weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }, 
    location: { type: String, required: true }, 
    healthInfo: { type: String, default: 'Vaccinated, dewormed, and in good health.' },
    description: { type: String, required: true },
    imageUrls: { 
        type: [String], 
        required: true,
        validate: [
            (val) => val.length > 0 && val.length <= 5,
            'A pet must have between 1 and 5 images.'
        ]
    },
    // 👇 rehomerId has been completely removed!
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Available', 'Pending', 'Adopted'], default: 'Available' }
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);