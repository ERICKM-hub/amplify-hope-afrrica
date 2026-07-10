import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['string', 'number', 'boolean', 'array', 'object'], 
    default: 'string' 
  },
  group: { 
    type: String, 
    default: 'general',
    trim: true,
  },
  description: { 
    type: String, 
    default: '' 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Pre-save middleware
SettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
