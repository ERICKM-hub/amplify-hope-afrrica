import mongoose from 'mongoose';

const FormSubmissionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['contact', 'volunteer', 'partner', 'donation', 'newsletter'] },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived', 'spam'], default: 'new' },
  notes: { type: String },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for faster queries
FormSubmissionSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.models.FormSubmission || mongoose.model('FormSubmission', FormSubmissionSchema);
