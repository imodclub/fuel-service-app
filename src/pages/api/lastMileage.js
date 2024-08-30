import dbConnect from '@/lib/dbConnect';
import FuelRefill from '@/models/FuelRefill';

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

        // ค้นหาการเติมน้ำมันล่าสุดที่มีค่า mileage ไม่ว่าง
        const lastRefill = await FuelRefill.findOne({ 
          vehicleId, 
          mileage: { $ne: null, $ne: '' } 
        }).sort({ refillDate: -1 });

        if (lastRefill) {
          res.status(200).json({ success: true, lastMileage: lastRefill.mileage });
        } else {
          res.status(200).json({ success: true, lastMileage: 0 });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}