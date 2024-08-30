import mongoose from 'mongoose';

const FuelRefillSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle'
  },
  refillDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
  },
  pricePerLiter: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

FuelRefillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.FuelRefill || mongoose.model('FuelRefill', FuelRefillSchema);