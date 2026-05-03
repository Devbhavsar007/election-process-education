import mongoose from 'mongoose';
const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  answers: { type: mongoose.Schema.Types.Mixed },
  takenAt: { type: Date, default: Date.now }
});
export default mongoose.model('QuizResult', quizResultSchema);
