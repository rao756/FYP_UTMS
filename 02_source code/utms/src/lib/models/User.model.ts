import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    userName: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    departmentName: { type: String, default: '' },
    semester: { type: String, default: '' },
    routeName: { type: String, default: '' },
    pickupStop: { type: String, default: '' },
    challanStatus: {
      type: String,
      enum: ['pending', 'Paid', 'Not Paid'],
      default: 'pending',
    },
    password: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
