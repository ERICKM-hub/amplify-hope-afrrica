'use client';

import { useEffect, useState } from 'react';

interface Impact {
  _id: string;
  title: string;
  content: string;
  section: string;
  data: any;
  images: string[];
}

export default function ImpactPage() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImpacts();
  }, []);

  const fetchImpacts = async () => {
    try {
      const res = await fetch('/api/public/content?page=impact');
      const data = await res.json();
      if (data.success) {
        setImpacts(data.data);
      } else {
        setError('Failed to load impact data');
      }
    } catch (error) {
      setError('Error loading impact data');
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
          <p style={{ color: styles.neutral600 }}>Loading impact data...</p>
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
            Our Impact
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            Making a difference in communities across Kenya
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {impacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>No impact data available.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {impacts.map((impact) => (
                <div
                  key={impact._id}
                  style={{
                    background: styles.white,
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${styles.neutral200}`,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                >
                  {impact.images && impact.images.length > 0 && (
                    <div style={{
                      height: '200px',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      marginBottom: '1.5rem',
                      background: styles.neutral100,
                    }}>
                      <img 
                        src={impact.images[0]} 
                        alt={impact.title || 'Impact'} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }} 
                      />
                    </div>
                  )}
                  {impact.title && (
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: styles.primary,
                      marginBottom: '0.75rem',
                    }}>
                      {impact.title}
                    </h2>
                  )}
                  {impact.content && (
                    <p style={{ 
                      color: styles.neutral600, 
                      lineHeight: '1.8',
                      fontSize: '1rem',
                    }}>
                      {impact.content}
                    </p>
                  )}
                  {impact.data && Object.keys(impact.data).length > 0 && (
                    <div style={{ 
                      marginTop: '1rem', 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.75rem',
                    }}>
                      {Object.entries(impact.data).map(([key, value]) => (
                        <div
                          key={key}
                          style={{
                            background: '#DBEAFE',
                            color: styles.primary,
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <strong style={{ fontSize: '0.875rem' }}>{key}:</strong>
                          <span style={{ fontSize: '0.875rem' }}>{String(value)}</span>
                        </div>
                      ))}
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
