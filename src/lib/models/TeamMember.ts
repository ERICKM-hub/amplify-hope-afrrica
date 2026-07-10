import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  email: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
