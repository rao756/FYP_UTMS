import { Schema, model, models } from 'mongoose';

const RouteSchema = new Schema(
  {
    routeId: { type: String, default: '', unique: true },
    routeName: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Route = models.Route || model('Route', RouteSchema);

export default Route;
