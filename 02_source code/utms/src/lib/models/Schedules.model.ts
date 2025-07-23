import { Schema, model, models } from 'mongoose';

const StopSchema = new Schema({
  stopName: { type: String, required: true },
  arrivalTime: { type: String, required: true }, // Change type to String
  departureTime: { type: String, required: true }, // Change type to String
});

const ScheduleSchema = new Schema(
  {
    scheduleId: { type: String, default: '' },
    routeName: { type: String, default: '' },
    busId: { type: String, required: true },
    driverId: { type: String, required: true },
    stops: [StopSchema],
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Schedule = models.Schedule || model('Schedule', ScheduleSchema);

export default Schedule;
