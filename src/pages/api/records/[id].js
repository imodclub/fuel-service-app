import dbConnect from '../../../lib/dbConnect';
import FuelRefill from '../../../models/FuelRefill';
import Maintenance from '../../../models/Maintenance';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const { type, updateData } = req.body;

        if (!type || !updateData) {
          return res
            .status(400)
            .json({
              success: false,
              error: 'Type and update data are required',
            });
        }

        let updatedRecord;
        if (type === 'fuel') {
          updatedRecord = await FuelRefill.findByIdAndUpdate(id, updateData, {
            new: true,
          });
        } else if (type === 'maintenance') {
          updatedRecord = await Maintenance.findByIdAndUpdate(id, updateData, {
            new: true,
          });
        } else {
          return res
            .status(400)
            .json({ success: false, error: 'Invalid type' });
        }

        if (!updatedRecord) {
          return res
            .status(404)
            .json({ success: false, error: 'Record not found' });
        }

        res.status(200).json({ success: true, data: updatedRecord });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
