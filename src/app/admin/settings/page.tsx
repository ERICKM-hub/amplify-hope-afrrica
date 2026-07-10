'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Setting {
  key: string;
  value: any;
  type: string;
  group: string;
  description: string;
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('general');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    username: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        name: session.user.name || '',
        email: session.user.email || '',
        username: (session.user as any).username || '',
      });
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: profileForm.name,
            email: profileForm.email,
            username: profileForm.username,
          }
        });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Password updated successfully!', type: 'success' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.error || 'Failed to update password', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ text: 'Error updating password', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const createDefaultSettings = async () => {
    const defaults = [
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
    for (const setting of defaults) {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
      });
    }
    fetchSettings();
  };

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading settings...</div>;
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) acc[setting.group] = [];
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '0.5rem' }}>
        Settings
      </h1>
      <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
        Manage your website settings and profile
      </p>

      {message.text && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          background: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
          color: message.type === 'error' ? '#991B1B' : '#065F46',
          border: '1px solid ' + (message.type === 'error' ? '#991B1B' : '#065F46'),
        }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #E5E7EB',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '0.5rem 1.5rem',
            background: activeTab === 'general' ? '#1A5D3C' : 'transparent',
            color: activeTab === 'general' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'general' ? '600' : '400',
          }}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.5rem 1.5rem',
            background: activeTab === 'profile' ? '#1A5D3C' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'profile' ? '600' : '400',
          }}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          style={{
            padding: '0.5rem 1.5rem',
            background: activeTab === 'password' ? '#1A5D3C' : 'transparent',
            color: activeTab === 'password' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'password' ? '600' : '400',
          }}
        >
          Change Password
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <>
          {Object.entries(groupedSettings).length === 0 ? (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No settings found.</p>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Click the button below to create default settings.</p>
              <button
                onClick={createDefaultSettings}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1.5rem',
                  background: '#1A5D3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Create Default Settings
              </button>
            </div>
          ) : (
            Object.entries(groupedSettings).map(([group, items]) => (
              <div key={group} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', textTransform: 'capitalize' }}>
                  {group}
                </h2>
                <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  {items.map((setting) => (
                    <div
                      key={setting.key}
                      style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid #F3F4F6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <label style={{ fontWeight: '500', color: '#1F2937', display: 'block', marginBottom: '0.25rem' }}>
                          {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        {setting.description && (
                          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{setting.description}</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {setting.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={setting.value}
                            onChange={(e) => updateSetting(setting.key, e.target.checked)}
                            style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                          />
                        ) : (
                          <input
                            type={setting.type === 'number' ? 'number' : 'text'}
                            value={setting.value || ''}
                            onChange={(e) => {
                              const val = setting.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                              setSettings(settings.map(s => s.key === setting.key ? { ...s, value: val } : s));
                            }}
                            onBlur={() => updateSetting(setting.key, setting.value)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #D1D5DB',
                              borderRadius: '0.25rem',
                              minWidth: '200px',
                              fontSize: '0.875rem',
                            }}
                          />
                        )}
                        {saving && <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Saving...</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '1.5rem' }}>
            Update Profile
          </h2>
          <form onSubmit={updateProfile}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Username *
              </label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.5rem 1.5rem',
                background: saving ? '#9CA3AF' : '#1A5D3C',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '1.5rem' }}>
            Change Password
          </h2>
          <form onSubmit={updatePassword}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Current Password *
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                New Password *
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Password must be at least 6 characters long
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.5rem 1.5rem',
                background: saving ? '#9CA3AF' : '#1A5D3C',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {saving ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
