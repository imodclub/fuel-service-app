import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user && user.password === password) { // ในการใช้งานจริง ควรใช้การเข้ารหัสรหัสผ่าน
        const token = sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'strict',
          path: '/'
        }));

        res.status(200).json({ success: true, userId: user._id });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}