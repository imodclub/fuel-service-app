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
            licensePlate: { type: String, required: true, unique: true },
            vehicleType: { type: String, required: true },
            brand: { type: String, required: true },
            model: { type: String, required: true },
            engineCC: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          })
        );

      // ตรวจสอบว่ามีรถทะเบียนนี้อยู่แล้วหรือไม่
      const existingVehicle = await VehicleModel.findOne({ licensePlate: vehicleData.licensePlate });
      if (existingVehicle) {
        return res.status(400).json({ success: false, message: 'ทะเบียนรถนี้มีอยู่ในระบบแล้ว' });
      }

      const newVehicle = new VehicleModel({
        ...vehicleData,
        userId: new mongoose.Types.ObjectId(userId),
      });

      const savedVehicle = await newVehicle.save();

      res.status(201).json({ success: true, id: savedVehicle._id });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      if (error.code === 11000) {
        res.status(400).json({ success: false, message: 'ทะเบียนรถนี้มีอยู่ในระบบแล้ว' });
      } else {
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลรถ' });
      }
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}