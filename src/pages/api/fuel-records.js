import dbConnect from '../../lib/dbConnect';
import FuelRefill from '../../models/FuelRefill';

export default async function handler(req, res) {
  const { method } = req;
  const { vehicleId } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        if (!vehicleId) {
          return res.status(400).json({ success: false, error: 'Vehicle ID is required' });
        }

        const fuelRecords = await FuelRefill.find({ vehicleId }).sort({ date: -1 });
        res.status(200).json({ success: true, data: fuelRecords });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}