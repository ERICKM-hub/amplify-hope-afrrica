const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, default: 'string' },
  group: { type: String, default: 'general' },
  description: { type: String, default: '' },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

const defaultSettings = [
  { key: 'site_title', value: 'Amplify Hope Africa', type: 'string', group: 'general', description: 'Site title' },
  { key: 'site_description', value: 'Empowering communities across Africa', type: 'string', group: 'general', description: 'Site description' },
  { key: 'contact_email', value: 'info@amplifyhopeafrica.org', type: 'string', group: 'contact', description: 'Contact email address' },
  { key: 'contact_phone', value: '+254 700 000 000', type: 'string', group: 'contact', description: 'Contact phone number' },
  { key: 'address', value: 'Nairobi, Kenya', type: 'string', group: 'contact', description: 'Physical address' },
  { key: 'facebook', value: 'https://facebook.com/amplifyhopeafrica', type: 'string', group: 'social', description: 'Facebook URL' },
  { key: 'twitter', value: 'https://twitter.com/amplifyhopeafrica', type: 'string', group: 'social', description: 'Twitter URL' },
  { key: 'instagram', value: 'https://instagram.com/amplifyhopeafrica', type: 'string', group: 'social', description: 'Instagram URL' },
  { key: 'linkedin', value: 'https://linkedin.com/company/amplifyhopeafrica', type: 'string', group: 'social', description: 'LinkedIn URL' },
  { key: 'youtube', value: 'https://youtube.com/amplifyhopeafrica', type: 'string', group: 'social', description: 'YouTube URL' },
];

async function createSettings() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected!');

    for (const setting of defaultSettings) {
      const existing = await Settings.findOne({ key: setting.key });
      if (!existing) {
        await Settings.create(setting);
        console.log(`✅ Created: ${setting.key}`);
      } else {
        console.log(`⏭️ Skipped: ${setting.key} (already exists)`);
      }
    }

    console.log('✅ Settings created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSettings();
