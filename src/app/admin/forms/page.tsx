'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FormSubmission {
  _id: string;
  type: string;
  data: Record<string, any>;
  status: 'new' | 'read' | 'replied' | 'archived' | 'spam';
  createdAt: string;
  notes?: string;
}

export default function FormsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<FormSubmission | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/forms');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/forms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(submissions.map(s => s._id === id ? { ...s, status: newStatus as any } : s));
        if (selected?._id === id) {
          setSelected({ ...selected, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/forms?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSubmissions(submissions.filter(s => s._id !== deleteId));
        if (selected?._id === deleteId) {
          setSelected(null);
        }
        setShowDeleteConfirm(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const handleReply = async () => {
    if (!selected || !replyMessage.trim()) return;

    setReplySending(true);
    setReplySuccess('');

    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selected._id,
          email: selected.data.email,
          subject: selected.data.subject || 'Re: Your message to Amplify Hope Africa',
          message: replyMessage,
          type: selected.type,
          name: selected.data.name || 'Valued Supporter',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplySuccess('Reply sent successfully!');
        await updateStatus(selected._id, 'replied');
        setTimeout(() => {
          setShowReplyModal(false);
          setReplyMessage('');
          setReplySuccess('');
        }, 2000);
      } else {
        setReplySuccess('Error: ' + (data.error || 'Failed to send reply'));
      }
    } catch (error) {
      console.error('Reply error:', error);
      setReplySuccess('Error sending reply. Please try again.');
    } finally {
      setReplySending(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: { bg: '#FEF3C7', text: '#92400E' },
      read: { bg: '#DBEAFE', text: '#1E40AF' },
      replied: { bg: '#D1FAE5', text: '#065F46' },
      archived: { bg: '#F3F4F6', text: '#4B5563' },
      spam: { bg: '#FEE2E2', text: '#991B1B' },
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filter);

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading submissions...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A5D3C' }}>
          Form Submissions
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'new', 'read', 'replied', 'archived', 'spam'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.25rem 0.75rem',
                background: filter === f ? '#1A5D3C' : '#F3F4F6',
                color: filter === f ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No form submissions yet.</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Forms will appear here once submitted.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredSubmissions.map((sub) => {
            const statusColors = getStatusColor(sub.status);
            const isContact = sub.type === 'contact' || sub.data.subject;
            const displayName = sub.data.name || sub.data.fullName || 'Anonymous';
            const displayEmail = sub.data.email || 'No email provided';
            const displayMessage = sub.data.message || sub.data.content || 'No message';
            const isArchived = sub.status === 'archived';

            return (
              <div
                key={sub._id}
                style={{
                  background: isArchived ? '#F9FAFB' : 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: selected?._id === sub._id ? '2px solid #1A5D3C' : '1px solid transparent',
                  opacity: isArchived ? 0.6 : 1,
                }}
                onClick={() => setSelected(selected?._id === sub._id ? null : sub)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#1F2937' }}>
                        {displayName}
                      </strong>
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        {displayEmail}
                      </span>
                      <span style={{
                        background: statusColors.bg,
                        color: statusColors.text,
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}>
                        {sub.status}
                      </span>
                      <span style={{ 
                        color: '#9CA3AF', 
                        fontSize: '0.75rem',
                        background: '#F3F4F6',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                      }}>
                        {isContact ? 'Contact' : sub.type}
                      </span>
                    </div>
                    <p style={{ 
                      color: '#6B7280', 
                      fontSize: '0.875rem', 
                      marginTop: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {displayMessage}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {new Date(sub.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Reply Button - Only for contact submissions that are not archived */}
                    {isContact && !isArchived && sub.status !== 'replied' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(sub);
                          setShowReplyModal(true);
                        }}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#1A5D3C',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Reply
                      </button>
                    )}

                    {/* Archive Button - Hide for already archived */}
                    {!isArchived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(sub._id, 'archived');
                        }}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#F3F4F6',
                          color: '#374151',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Archive
                      </button>
                    )}

                    {/* Delete Button - Always visible except for archived */}
                    {!isArchived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(sub._id);
                          setShowDeleteConfirm(true);
                        }}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#FEE2E2',
                          color: '#991B1B',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    )}

                    {/* Status Dropdown */}
                    <select
                      value={sub.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(sub._id, e.target.value);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        background: 'white',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>
                </div>

                {/* Expanded Details */}
                {selected?._id === sub._id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.5rem', 
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}>
                      {Object.entries(sub.data).map(([key, value]) => {
                        if (typeof value === 'object') return null;
                        return (
                          <div key={key}>
                            <strong style={{ color: '#6B7280', textTransform: 'capitalize' }}>{key}:</strong>
                            <span style={{ color: '#1F2937', marginLeft: '0.25rem' }}>{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                    {sub.notes && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#F9FAFB', borderRadius: '0.25rem' }}>
                        <strong style={{ color: '#6B7280', fontSize: '0.875rem' }}>Notes:</strong>
                        <p style={{ color: '#1F2937', fontSize: '0.875rem', marginTop: '0.25rem' }}>{sub.notes}</p>
                      </div>
                    )}
                    {isContact && sub.status !== 'replied' && !isArchived && (
                      <div style={{ marginTop: '1rem' }}>
                        <button
                          onClick={() => setShowReplyModal(true)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#1A5D3C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Reply to this message
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selected && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A5D3C', marginBottom: '0.5rem' }}>
              Reply to {selected.data.name || 'Anonymous'}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Sending reply to: {selected.data.email}
            </p>

            {replySuccess && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                background: replySuccess.includes('Error') ? '#FEE2E2' : '#D1FAE5',
                color: replySuccess.includes('Error') ? '#991B1B' : '#065F46',
              }}>
                {replySuccess}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Subject
              </label>
              <input
                type="text"
                value={selected.data.subject || 'Re: Your message to Amplify Hope Africa'}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.375rem',
                  background: '#F9FAFB',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                Message *
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
                placeholder="Type your reply here..."
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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                  setReplySuccess('');
                }}
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
                onClick={handleReply}
                disabled={replySending || !replyMessage.trim()}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: (replySending || !replyMessage.trim()) ? '#9CA3AF' : '#1A5D3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (replySending || !replyMessage.trim()) ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                }}
              >
                {replySending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteId && (
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
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteId(null);
                }}
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
                onClick={handleDelete}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#991B1B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
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
