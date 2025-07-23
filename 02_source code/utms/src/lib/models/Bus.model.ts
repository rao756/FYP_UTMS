import { Schema, model, models } from 'mongoose';

const BusSchema = new Schema(
  {
    busId: { type: String, default: '', unique: true },
    busRoute: { type: String, default: '', trim: true },
    busNumber: { type: String, default: '', unique: true, trim: true },
    busSeats: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Bus = models.Bus || model('Bus', BusSchema);

export default Bus;
