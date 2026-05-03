import mongoose from 'mongoose';
const queryLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: { type: String, required: true },
  provider: { type: String, required: true },
  responseTime: { type: Number },
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('QueryLog', queryLogSchema);
