'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    isActive: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchMembers();
    }
  }, [session]);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/team` : '/api/admin/team';
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing._id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ name: '', role: '', bio: '', image: '', isActive: true });
        fetchMembers();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMembers(members.filter(m => m._id !== id));
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditing(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        image: member.image || '',
        isActive: member.isActive,
      });
    } else {
      setEditing(null);
      setFormData({ name: '', role: '', bio: '', image: '', isActive: true });
    }
    setShowModal(true);
  };

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading team members...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C' }}>
          Team Members
        </h1>
        <Link
          href="/admin/team/new"
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1A5D3C',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            textDecoration: 'none',
          }}
        >
          + Add Team Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No team members yet.</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Click "Add Team Member" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {members.map((member) => (
            <div
              key={member._id}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  overflow: 'hidden',
                }}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#1F2937' }}>{member.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{member.role}</p>
                  {!member.isActive && (
                    <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>Inactive</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openModal(member)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                >
                   Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#FEE2E2',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: '#991B1B',
                  }}
                >
                   Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '1rem' }}>
              {editing ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem' }}
                  placeholder="Full name"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem' }}
                  placeholder="Job title"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem' }}
                  placeholder="Brief bio"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem' }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#1A5D3C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
