import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.query;
        const vehicles = await Vehicle.find({ userId });
        res.status(200).json(vehicles);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
