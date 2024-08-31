import dbConnect from '@/lib/dbConnect';
import Maintenance from '@/models/Maintenance';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const maintenance = await Maintenance.create(req.body);
        res.status(201).json({ success: true, data: maintenance });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
