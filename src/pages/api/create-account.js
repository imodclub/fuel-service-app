import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { username, password } = req.body;

    // ตรวจสอบค่าว่างและช่องว่าง
    if (!username || !password || username.trim() !== username) {
      return res.status(400).json({ 
        success: false, 
        message: 'ชื่อผู้ใช้และรหัสผ่านต้องไม่เป็นค่าว่าง และชื่อผู้ใช้ต้องไม่มีช่องว่าง' 
      });
    }

    try {
      // ตรวจสอบชื่อซ้ำ
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
      }

      // สร้างผู้ใช้ใหม่
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ success: true, message: 'สร้างบัญชีสำเร็จ' });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างบัญชี' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}