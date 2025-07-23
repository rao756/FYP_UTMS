import { Schema, model, models } from 'mongoose';

const DriverSchema = new Schema(
  {
    driverId: { type: String, default: '', unique: true },
    driverName: { type: String, default: '', trim: true },
    driverLicense: { type: String, default: '', unique: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Driver = models.Driver || model('Driver', DriverSchema);

export default Driver;
