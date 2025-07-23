import { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema(
  {
    notificationMessage: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Notification =
  models.Notification || model('Notification', NotificationSchema);

export default Notification;
