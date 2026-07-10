'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Content type definitions with dynamic fields
const CONTENT_TYPES = {
  blog: {
    label: 'Blog Post',
    fields: ['title', 'content', 'excerpt', 'category', 'tags', 'image'],
    sections: ['articles', 'stories', 'updates'],
    page: 'blog',
    limit: 10,
    useTeamForm: false,
  },
  'our-work': {
    label: 'Our Work',
    fields: ['title', 'content', 'programType', 'location', 'image'],
    sections: ['programs', 'initiatives', 'projects'],
    page: 'our-work',
    limit: 10,
    useTeamForm: false,
  },
  impact: {
    label: 'Impact',
    fields: ['title', 'content', 'metric', 'beneficiaries', 'image'],
    sections: ['stats', 'achievements', 'case-studies'],
    page: 'impact',
    limit: 10,
    useTeamForm: false,
  },
  reports: {
    label: 'Report',
    fields: ['title', 'content', 'reportType', 'year', 'file', 'image'],
    sections: ['annual', 'financial', 'impact'],
    page: 'reports',
    limit: 10,
    useTeamForm: false,
  },
  gallery: {
    label: 'Gallery Image',
    fields: ['title', 'image', 'description', 'location'],
    sections: ['images'],
    page: 'gallery',
    limit: 1000,
    useTeamForm: false,
  },
  team: {
    label: 'Team Member',
    fields: ['name', 'role', 'bio', 'image', 'email'],
    sections: ['members'],
    page: 'team',
    limit: 10,
    useTeamForm: true,
  },
};

interface FormData {
  contentType: string;
  page: string;
  section: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  image: File | null;
  imageUrl: string;
  file: File | null;
  fileUrl: string;
  programType: string;
  location: string;
  metric: string;
  beneficiaries: string;
  reportType: string;
  year: string;
  description: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  isPublished: boolean;
}

export default function NewContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    contentType: 'blog',
    page: 'blog',
    section: 'articles',
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: null,
    imageUrl: '',
    file: null,
    fileUrl: '',
    programType: '',
    location: '',
    metric: '',
    beneficiaries: '',
    reportType: '',
    year: '',
    description: '',
    name: '',
    role: '',
    bio: '',
    email: '',
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [availableSections, setAvailableSections] = useState<string[]>(['articles']);
  const [sectionLimit, setSectionLimit] = useState<number>(10);
  const [isTeamForm, setIsTeamForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Update sections and limit when content type changes
  useEffect(() => {
    const contentType = formData.contentType as keyof typeof CONTENT_TYPES;
    const config = CONTENT_TYPES[contentType];
    if (config) {
      setAvailableSections(config.sections);
      setSectionLimit(config.limit || 10);
      setIsTeamForm(config.useTeamForm || false);
      setFormData(prev => ({
        ...prev,
        page: config.page,
        section: config.sections[0] || '',
      }));
    }
  }, [formData.contentType]);

  const uploadFile = async (file: File, type: 'image' | 'document'): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', type);

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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: 'Invalid file type. Please upload JPEG, PNG, WEBP, GIF, or SVG.', type: 'error' });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: 'File too large. Maximum size is 5MB.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: 'Uploading image...', type: '' });

    try {
      const imageUrl = await uploadFile(file, 'image');
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: imageUrl,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ 
        text: 'Invalid file type. Please upload PDF, DOC, DOCX, XLS, or XLSX.', 
        type: 'error' 
      });
      return;
    }

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: 'File too large. Maximum size is 20MB.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: 'Uploading file...', type: '' });

    try {
      const fileUrl = await uploadFile(file, 'document');
      setFormData(prev => ({
        ...prev,
        file: file,
        fileUrl: fileUrl,
      }));
      setMessage({ text: 'File uploaded successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: 'Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'), type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const contentType = formData.contentType as keyof typeof CONTENT_TYPES;
      const config = CONTENT_TYPES[contentType];
      const imageUrl = formData.imageUrl;
      const fileUrl = formData.fileUrl;

      // If it's a team member, use the team API
      if (config.useTeamForm) {
        // Validate team fields
        if (!formData.name || !formData.role) {
          setMessage({ text: 'Name and role are required.', type: 'error' });
          setSaving(false);
          return;
        }

        const teamPayload = {
          name: formData.name,
          role: formData.role,
          bio: formData.bio || '',
          image: imageUrl || '',
          email: formData.email || '',
          isActive: formData.isPublished,
        };

        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teamPayload),
        });

        const data = await res.json();
        if (data.success) {
          setMessage({ text: 'Team member added successfully! Redirecting...', type: 'success' });
          setTimeout(() => router.push('/admin/team'), 1500);
        } else {
          setMessage({ text: 'Error: ' + (data.error || 'Unknown error'), type: 'error' });
        }
        setSaving(false);
        return;
      }

      // Handle other content types
      let payload: any = {
        page: formData.page,
        section: formData.section,
        isPublished: formData.isPublished,
        data: {},
        images: [],
      };

      switch (contentType) {
        case 'blog':
          payload.title = formData.title;
          payload.content = formData.content;
          payload.data = {
            excerpt: formData.excerpt,
            category: formData.category,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          };
          if (imageUrl) payload.images = [imageUrl];
          break;

        case 'our-work':
          payload.title = formData.title;
          payload.content = formData.content;
          payload.data = {
            programType: formData.programType,
            location: formData.location,
          };
          if (imageUrl) payload.images = [imageUrl];
          break;

        case 'impact':
          payload.title = formData.title;
          payload.content = formData.content;
          payload.data = {
            metric: formData.metric,
            beneficiaries: formData.beneficiaries,
          };
          if (imageUrl) payload.images = [imageUrl];
          break;

        case 'reports':
          payload.title = formData.title;
          payload.content = formData.content;
          payload.data = {
            reportType: formData.reportType,
            year: formData.year,
            file: fileUrl,
          };
          if (imageUrl) payload.images = [imageUrl];
          break;

        case 'gallery':
          payload.title = formData.title;
          payload.data = {
            description: formData.description,
            location: formData.location,
          };
          if (imageUrl) payload.images = [imageUrl];
          break;

        default:
          payload.title = formData.title || formData.name;
          payload.content = formData.content || formData.bio;
          if (imageUrl) payload.images = [imageUrl];
      }

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Content created successfully! Redirecting...', type: 'success' });
        setTimeout(() => router.push('/admin/content'), 1500);
      } else {
        setMessage({ text: 'Error: ' + (data.error || 'Unknown error'), type: 'error' });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ text: 'Error saving content. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  }

  const contentType = formData.contentType as keyof typeof CONTENT_TYPES;
  const config = CONTENT_TYPES[contentType];

  // Team Form - Full width display
  if (isTeamForm) {
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
          {/* Content Type (hidden but needed) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
              Content Type
            </label>
            <input
              type="text"
              value="Team Member"
              disabled
              style={{ 
                width: '100%', 
                padding: '0.5rem 1rem', 
                border: '1px solid #D1D5DB', 
                borderRadius: '0.375rem',
                fontSize: '1rem',
                background: '#F3F4F6',
                color: '#6B7280',
              }}
            />
          </div>

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
            {formData.imageUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ color: '#065F46', fontSize: '0.875rem' }}>
                  Image uploaded
                </span>
                <div style={{ marginTop: '0.25rem' }}>
                  <img
                    src={formData.imageUrl}
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

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.25rem',
              color: '#374151',
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="team@example.com"
              style={{ 
                width: '100%', 
                padding: '0.5rem 1rem', 
                border: '1px solid #D1D5DB', 
                borderRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
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
                name="isPublished"
                checked={formData.isPublished}
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

  // Regular Content Form
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '0.5rem' }}>
        Add New Content
      </h1>
      <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
        Create content for {config?.label || 'your website'}
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

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Content Type Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
            Content Type *
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              background: 'white',
            }}
          >
            {Object.entries(CONTENT_TYPES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>

        {/* Section Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
            Section *
          </label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              background: 'white',
            }}
          >
            {availableSections.map((section) => (
              <option key={section} value={section}>
                {section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Maximum {sectionLimit} items allowed for this section.
          </p>
        </div>

        {/* Dynamic Fields */}
        <div style={{ marginBottom: '1rem' }}>
          {config?.fields.map((field) => {
            // Title field
            if (field === 'title' && ['blog', 'our-work', 'impact', 'reports', 'gallery'].includes(formData.contentType)) {
              return (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} *
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field as keyof FormData] as string}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              );
            }

            // Content field
            if (field === 'content') {
              return (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    Content
                  </label>
                  <textarea
                    name={field}
                    value={formData[field as keyof FormData] as string}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Main content body"
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
              );
            }

            // Image upload field
            if (field === 'image') {
              return (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    Image
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
                      }}
                    />
                    {uploading && (
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Uploading...
                      </span>
                    )}
                  </div>
                  {formData.imageUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ color: '#065F46', fontSize: '0.875rem' }}>
                        Image uploaded: {formData.image?.name || 'file'}
                      </span>
                      <div style={{ marginTop: '0.25rem' }}>
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{
                            maxWidth: '150px',
                            maxHeight: '100px',
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
              );
            }

            // File upload field for reports
            if (field === 'file') {
              return (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    Report File *
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    <input
                      type="file"
                      ref={reportFileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        minWidth: '200px',
                      }}
                    />
                    {uploading && (
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Uploading...
                      </span>
                    )}
                  </div>
                  {formData.fileUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ color: '#065F46', fontSize: '0.875rem' }}>
                        File uploaded: {formData.file?.name || 'file'}
                      </span>
                      <div style={{ marginTop: '0.25rem' }}>
                        <a
                          href={formData.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#1A5D3C',
                            textDecoration: 'underline',
                            fontSize: '0.875rem',
                          }}
                        >
                          View uploaded file
                        </a>
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    Supported: PDF, DOC, DOCX, XLS, XLSX. Max size: 20MB
                  </p>
                </div>
              );
            }

            // Text fields
            if (['excerpt', 'category', 'programType', 'location', 'metric', 'beneficiaries', 'reportType', 'year', 'description', 'email'].includes(field)) {
              const labelMap: Record<string, string> = {
                excerpt: 'Excerpt (short summary)',
                category: 'Category',
                tags: 'Tags (comma separated)',
                programType: 'Program Type',
                location: 'Location',
                metric: 'Metric / Number',
                beneficiaries: 'Beneficiaries',
                reportType: 'Report Type',
                year: 'Year',
                description: 'Description',
                email: 'Email Address',
              };
              return (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    {labelMap[field] || field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === 'year' ? 'number' : 'text'}
                    name={field}
                    value={formData[field as keyof FormData] as string}
                    onChange={handleChange}
                    placeholder={labelMap[field] || field}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Published Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              style={{ width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>Published</span>
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => router.push('/admin/content')}
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
            {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
