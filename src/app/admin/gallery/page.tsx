'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GalleryImage {
  _id: string;
  title: string;
  content: string;
  images: string[];
  data: {
    description?: string;
    location?: string;
  };
  isPublished: boolean;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    location: '',
    image: null as File | null,
    isPublished: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchGalleryImages();
    }
  }, [session]);

  const fetchGalleryImages = async () => {
    try {
      const res = await fetch('/api/admin/content?page=gallery');
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: 'Invalid file type. Please upload JPEG, PNG, WEBP, GIF, or SVG.', type: 'error' });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: 'File too large. Maximum size is 10MB.', type: 'error' });
      return;
    }

    setUploadForm(prev => ({ ...prev, image: file }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }
    return data.url;
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      if (!uploadForm.image) {
        setMessage({ text: 'Please select an image to upload.', type: 'error' });
        setUploading(false);
        return;
      }

      const imageUrl = await uploadImage(uploadForm.image);

      const payload = {
        page: 'gallery',
        section: 'images',
        title: uploadForm.title || 'Gallery Image',
        content: uploadForm.description || '',
        data: {
          description: uploadForm.description || '',
          location: uploadForm.location || '',
        },
        images: [imageUrl],
        isPublished: uploadForm.isPublished,
      };

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        setShowUploadModal(false);
        setUploadForm({ title: '', description: '', location: '', image: null, isPublished: true });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchGalleryImages();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Error: ' + (data.error || 'Upload failed'), type: 'error' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: 'Error uploading image. Please try again.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/content?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setImages(images.filter(img => img._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
        setMessage({ text: 'Image deleted successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({ text: 'Error deleting image.', type: 'error' });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const image = images.find(img => img._id === id);
      if (!image) return;

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isPublished: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImages(images.map(img =>
          img._id === id ? { ...img, isPublished: !currentStatus } : img
        ));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading gallery...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C' }}>
            Gallery
          </h1>
          <p style={{ color: '#6B7280' }}>
            Manage your gallery images ({images.length} images)
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1A5D3C',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          + Upload Image
        </button>
      </div>

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

      {images.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No images uploaded yet.</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Click "Upload Image" to add your first image.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}>
          {images.map((image) => {
            const imageUrl = image.images && image.images.length > 0 ? image.images[0] : '';
            return (
              <div
                key={image._id}
                style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #E5E7EB',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                {imageUrl ? (
                  <div style={{
                    height: '180px',
                    overflow: 'hidden',
                    background: '#F3F4F6',
                  }}>
                    <img
                      src={imageUrl}
                      alt={image.title || 'Gallery image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F3F4F6',
                    color: '#9CA3AF',
                  }}>
                    No Image
                  </div>
                )}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '0.25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {image.title || 'Untitled'}
                  </h3>
                  {image.data?.description && (
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#6B7280',
                      marginBottom: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {image.data.description}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                  }}>
                    <button
                      onClick={() => togglePublish(image._id, image.isPublished)}
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        background: image.isPublished ? '#D1FAE5' : '#F3F4F6',
                        color: image.isPublished ? '#065F46' : '#4B5563',
                      }}
                    >
                      {image.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setDeleteId(image._id);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          padding: '0.125rem 0.5rem',
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          color: '#991B1B',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '1.5rem' }}>
              Upload Gallery Image
            </h2>
            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                  Image *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Supported: JPEG, PNG, WEBP, GIF, SVG. Max size: 10MB
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Image title"
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
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={3}
                  placeholder="Image description"
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                  placeholder="e.g., Nairobi, Kenya"
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={uploadForm.isPublished}
                    onChange={(e) => setUploadForm({ ...uploadForm, isPublished: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Published</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadForm({ title: '', description: '', location: '', image: null, isPublished: true });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: uploading ? '#9CA3AF' : '#1A5D3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#991B1B', marginBottom: '1rem' }}>
              Confirm Delete
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#991B1B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
