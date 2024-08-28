// pages/api/fuelRefills.js
import dbConnect from '../../lib/dbConnect';
import FuelRefill from '../../models/FuelRefill';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const fuelRefill = await FuelRefill.create(req.body);
        res.status(201).json({ success: true, data: fuelRefill });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}