'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WorkItem {
  _id: string;
  title: string;
  content: string;
  section: string;
  images: string[];
  data: any;
}

export default function OurWorkPage() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkItems();
  }, []);

  const fetchWorkItems = async () => {
    try {
      const res = await fetch('/api/public/content?page=our-work');
      const data = await res.json();
      if (data.success) {
        setWorkItems(data.data);
      } else {
        setError('Failed to load our work');
      }
    } catch (error) {
      setError('Error loading our work');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    secondary: '#D4AF37',
    white: '#FFFFFF',
    neutral50: '#F9FAFB',
    neutral100: '#F3F4F6',
    neutral200: '#E5E7EB',
    neutral600: '#4B5563',
    neutral700: '#374151',
  };

  if (loading) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: styles.neutral600 }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section style={{ 
        background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryDark})`, 
        color: styles.white, 
        padding: '4rem 1rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Our Work
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            How we empower communities across Kenya
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {workItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>No work items found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {workItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: styles.white,
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${styles.neutral200}`,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                >
                  {item.images && item.images.length > 0 && (
                    <div style={{
                      height: '200px',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      marginBottom: '1.5rem',
                      background: styles.neutral100,
                    }}>
                      <img 
                        src={item.images[0]} 
                        alt={item.title || 'Work item'} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }} 
                      />
                    </div>
                  )}
                  {item.title && (
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: styles.primary,
                      marginBottom: '0.75rem',
                    }}>
                      {item.title}
                    </h2>
                  )}
                  {item.content && (
                    <p style={{ 
                      color: styles.neutral600, 
                      lineHeight: '1.8',
                      fontSize: '1rem',
                    }}>
                      {item.content}
                    </p>
                  )}
                  {item.section && (
                    <div style={{ marginTop: '1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: styles.primary, 
                        background: '#DBEAFE',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                      }}>
                        {item.section}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
