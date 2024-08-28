import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

      const { userId, ...vehicleData } = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'User ID is required' });
      }

      // สร้าง model สำหรับ vehicles (ถ้ายังไม่มี)
      const VehicleModel =
        mongoose.models.Vehicle ||
        mongoose.model(
          'Vehicle',
          new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, required: true },
            licensePlate: String,
            vehicleType: String,
            brand: String,
            model: String,
            engineCC: String,
            createdAt: { type: Date, default: Date.now },
          })
        );

      const newVehicle = new VehicleModel({
        ...vehicleData,
        userId: new mongoose.Types.ObjectId(userId),
      });

      const savedVehicle = await newVehicle.save();

      res.status(200).json({ success: true, id: savedVehicle._id });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
