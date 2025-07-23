import { Schema, model, models } from 'mongoose';

const UploadChallanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rollNo: { type: String, required: true, trim: true },
    challanStatus: {
      type: String,
      enum: ['pending', 'Paid', 'Not Paid'],
      default: 'pending',
    },
    image: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UploadChallan =
  models.UploadChallan || model('UploadChallan', UploadChallanSchema);

export default UploadChallan;
