import dbConnect from '@/lib/dbConnect';
import FuelRefill from '@/models/FuelRefill';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { vehicleId } = req.query;
        const refills = await FuelRefill.find({ vehicleId }).sort({ refillDate: -1 }).limit(30);
        res.status(200).json(refills);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const fuelRefill = await FuelRefill.create(req.body);
        res.status(201).json({ success: true, data: fuelRefill });
      } catch (error) {
        console.log('error 400 ', req);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}