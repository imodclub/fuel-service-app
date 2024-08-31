// pages/api/maintenance-records.js
import dbConnect from '../../lib/dbConnect';
import Maintenance from '../../models/Maintenance';
import Vehicle from '../../models/Vehicle';

export default async function handler(req, res) {
  const { method } = req;
  const { userId, vehicleId } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        let query = {};
        if (vehicleId) {
          query.vehicleId = vehicleId;
        } else if (userId) {
          const vehicles = await Vehicle.find({ userId });
          const vehicleIds = vehicles.map((v) => v._id);
          query.vehicleId = { $in: vehicleIds };
        } else {
          return res
            .status(400)
            .json({
              success: false,
              error: 'User ID or Vehicle ID is required',
            });
        }

        const maintenanceRecords = await Maintenance.find(query).sort({
          serviceDate: -1,
        });
        res.status(200).json({ success: true, data: maintenanceRecords });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
