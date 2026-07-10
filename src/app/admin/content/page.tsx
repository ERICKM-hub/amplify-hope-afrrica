'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Content {
  _id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  data: Record<string, any>;
  images: string[];
  isPublished: boolean;
  updatedAt: string;
}

export default function ContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchContent();
    }
  }, [session]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success) {
        setContents(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/content?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContents(contents.filter(c => c._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const content = contents.find(c => c._id === id);
      if (!content) return;

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
        setContents(contents.map(c =>
          c._id === id ? { ...c, isPublished: !currentStatus } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const filteredContents = filter === 'all'
    ? contents
    : contents.filter(c => c.page === filter);

  const pages = ['all', ...new Set(contents.map(c => c.page))];

  if (status === 'loading' || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C' }}>
          Content Management
        </h1>
        <Link
          href="/admin/content/new"
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1A5D3C',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Add Content
        </Link>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setFilter(page)}
            style={{
              padding: '0.25rem 0.75rem',
              background: filter === page ? '#1A5D3C' : '#F3F4F6',
              color: filter === page ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textTransform: 'capitalize',
            }}
          >
            {page === 'all' ? 'All Pages' : page}
          </button>
        ))}
      </div>

      {filteredContents.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No content found.</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Click "Add Content" to get started.</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '0.5rem', overflow: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Page</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Section</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Updated</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((content) => (
                <tr key={content._id}>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      background: '#DBEAFE',
                      color: '#1E40AF',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                    }}>
                      {content.page}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                    {content.section}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                    {content.title || '-'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>
                    <button
                      onClick={() => togglePublish(content._id, content.isPublished)}
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        background: content.isPublished ? '#D1FAE5' : '#F3F4F6',
                        color: content.isPublished ? '#065F46' : '#4B5563',
                      }}
                    >
                      {content.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                    {new Date(content.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/content/edit/${content._id}`}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#F3F4F6',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          color: '#374151',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteId(content._id);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#991B1B',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '1rem' }}>
              Confirm Delete
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this content? This action cannot be undone.
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
