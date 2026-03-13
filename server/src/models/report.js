import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    // The person who clicked "Report"
    reporterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The ID of the Pet or the User being reported
    reportedItemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    }, 
    itemType: { 
        type: String, 
        enum: ['User', 'Pet'], 
        required: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Action Taken', 'Dismissed'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;