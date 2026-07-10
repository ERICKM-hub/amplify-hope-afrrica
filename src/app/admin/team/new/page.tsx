'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    imageFile: null as File | null,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }
    return data.url;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: 'Invalid file type. Please upload JPEG, PNG, WEBP, GIF, or SVG.', type: 'error' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: 'File too large. Maximum size is 5MB.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: 'Uploading image...', type: '' });

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        imageFile: file,
      }));
      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: 'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'), type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate required fields
      if (!formData.name || !formData.role) {
        setMessage({ text: 'Name and role are required.', type: 'error' });
        setSaving(false);
        return;
      }

      const payload = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio || '',
        image: formData.image || '',
        isActive: formData.isActive,
      };

      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Team member added successfully! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/admin/team'), 1500);
      } else {
        setMessage({ text: 'Error: ' + (data.error || 'Unknown error'), type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error saving team member. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '0.5rem' }}>
        Add Team Member
      </h1>
      <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
        Add a new team member to display on the public team page.
      </p>

      {message.text && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          background: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: message.type === 'success' ? '#065F46' : '#991B1B',
          border: '1px solid ' + (message.type === 'success' ? '#065F46' : '#991B1B'),
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        {/* Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.25rem',
            color: '#374151',
          }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            style={{ 
              width: '100%', 
              padding: '0.5rem 1rem', 
              border: '1px solid #D1D5DB', 
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.25rem',
            color: '#374151',
          }}>
            Role *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="e.g., Program Director, Communications Lead"
            style={{ 
              width: '100%', 
              padding: '0.5rem 1rem', 
              border: '1px solid #D1D5DB', 
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.25rem',
            color: '#374151',
          }}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Brief biography of the team member"
            style={{ 
              width: '100%', 
              padding: '0.5rem 1rem', 
              border: '1px solid #D1D5DB', 
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.25rem',
            color: '#374151',
          }}>
            Profile Image
          </label>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                minWidth: '200px',
                background: 'white',
              }}
            />
            {uploading && (
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Uploading...
              </span>
            )}
          </div>
          {formData.image && (
            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ color: '#065F46', fontSize: '0.875rem' }}>
                Image uploaded
              </span>
              <div style={{ marginTop: '0.25rem' }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    maxWidth: '120px',
                    maxHeight: '120px',
                    objectFit: 'cover',
                    borderRadius: '0.25rem',
                    border: '1px solid #D1D5DB',
                  }}
                />
              </div>
            </div>
          )}
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Supported: JPEG, PNG, WEBP, GIF, SVG. Max size: 5MB
          </p>
        </div>

        {/* Active Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            cursor: 'pointer' 
          }}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={{ width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>Active (visible on public team page)</span>
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => router.push('/admin/team')}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            style={{
              padding: '0.5rem 1.5rem',
              background: (saving || uploading) ? '#9CA3AF' : '#1A5D3C',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Add Team Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
