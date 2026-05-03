import mongoose from 'mongoose';
const checklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    id: { type: String, required: true },
    label: { type: String, required: true },
    done: { type: Boolean, default: false }
  }]
}, { timestamps: true });
export default mongoose.model('Checklist', checklistSchema);
