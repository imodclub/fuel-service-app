import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  licensePlate: {
    type: String,
    required: [true, 'กรุณาระบุทะเบียนรถ'],
    unique: true,
  },
  vehicleType: {
    type: String,
    required: [true, 'กรุณาระบุประเภทรถ'],
    enum: ['รถยนต์', 'จักรยานยนต์'],
  },
  brand: {
    type: String,
    required: [true, 'กรุณาระบุยี่ห้อรถ'],
  },
  model: {
    type: String,
    required: [true, 'กรุณาระบุรุ่นรถ'],
  },
  engineCC: {
    type: Number,
    required: [true, 'กรุณาระบุขนาดเครื่องยนต์ (CC)'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Vehicle ||
  mongoose.model('Vehicle', VehicleSchema);
