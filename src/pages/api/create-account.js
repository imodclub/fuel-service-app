import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating account' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}