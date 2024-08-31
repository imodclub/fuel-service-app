import mongoose from 'mongoose';

const MaintenanceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle',
  },
  mileage: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  serviceDate: {
    type: Date,
  },
  oilChange: {
    amount: Number,
    details: String,
  },
  oilFilter: {
    amount: Number,
    details: String,
  },
  additionalItems: [
    {
      item: String,
      amount: Number,
      details: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Maintenance ||
  mongoose.model('Maintenance', MaintenanceSchema);
