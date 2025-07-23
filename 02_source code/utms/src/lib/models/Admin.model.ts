import { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      default: () => `admin-${Date.now()}`,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'department_admin', 'treasure_admin'],
      default: 'super_admin',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;
