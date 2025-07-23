import { Schema, model, models } from 'mongoose';

const ChallanSchema = new Schema({
  SrNo: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  busStop: {
    type: String,
    required: true,
  },
  downloadStatus: {
    type: String,
    enum: ['true', 'false'],
    default: 'false',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Challan = models.Challan || model('Challan', ChallanSchema);

export default Challan;
