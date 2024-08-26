import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // เพิ่มฟิลด์อื่นๆ ตามต้องการ
});

export default mongoose.models.User || mongoose.model('User', UserSchema);