import { Schema, model, models } from 'mongoose';

const AdminChallanSchema = new Schema({
  accountNo: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
  },
  lastDate: {
    type: String,
    required: true,
  },
  maxChallan: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminChallan =
  models.AdminChallan || model('AdminChallan', AdminChallanSchema);

export default AdminChallan;
