import dbConnect from '../../lib/dbConnect';
import FuelRefill from '../../models/FuelRefill';

export default async function handler(req, res) {
  const { method } = req;
  const { vehicleId } = req.query;
  const { _id, refillDate, amount, totalPrice } = req.body;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        if (!vehicleId) {
          return res
            .status(400)
            .json({ success: false, error: 'Vehicle ID is required' });
        }

        const fuelRecords = await FuelRefill.find({ vehicleId }).sort({
          date: -1,
        });
        res.status(200).json({ success: true, data: fuelRecords });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!_id || !vehicleId) {
          return res
            .status(400)
            .json({
              success: false,
              error: 'Record ID and Vehicle ID are required',
            });
        }

        const updatedFuelRecord = await FuelRefill.findOneAndUpdate(
          { _id, vehicleId },
          { refillDate, amount, totalPrice },
          { new: true }
        );

        if (!updatedFuelRecord) {
          return res
            .status(404)
            .json({ success: false, error: 'Fuel record not found' });
        }

        res.status(200).json({ success: true, data: updatedFuelRecord });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
