import dbConnect from '../../lib/dbConnect';
import FuelRefill from '../../models/FuelRefill';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { vehicleId } = req.query;
        if (!vehicleId) {
          return res.status(400).json({ success: false, error: 'Vehicle ID is required' });
        }
        const fuelRefills = await FuelRefill.find({ vehicleId }).sort({ refillDate: -1 });
        res.status(200).json({ success: true, data: fuelRefills });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { vehicleId, refillDate, totalPrice, pricePerLiter, mileage } = req.body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!vehicleId || !refillDate || !totalPrice || !pricePerLiter) {
          return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // สร้างข้อมูลการเติมน้ำมันใหม่
        const newFuelRefill = new FuelRefill({
          vehicleId,
          refillDate,
          totalPrice: parseFloat(totalPrice),
          pricePerLiter: parseFloat(pricePerLiter),
          mileage: mileage ? parseFloat(mileage) : null,
          amount: totalPrice / pricePerLiter // คำนวณจำนวนลิตร
        });

        await newFuelRefill.save();
        res.status(201).json({ success: true, data: newFuelRefill });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}