import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  setting_name: { type: String, required: true, unique: true }, // e.g., 'sdg_weights'
  weights: { type: Map, of: Number, default: {} },
  default_weight: { type: Number, default: 80 }
}, { timestamps: true });

export default mongoose.model('SystemConfig', systemConfigSchema);