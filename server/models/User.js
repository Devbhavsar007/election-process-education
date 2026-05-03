import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  firebaseUID: { type: String, sparse: true },
  state: { type: String, default: '' },
  constituency: { type: String, default: '' },
  preferredLang: { type: String, default: 'en' },
  age: { type: Number },
  profileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', userSchema);
