'use client';

import { useEffect, useState } from 'react';
import { FaFilePdf, FaDownload, FaSpinner, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

interface Report {
  _id: string;
  title: string;
  content: string;
  data: any;
  images: string[];
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/public/content?page=reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      } else {
        setError('Failed to load reports');
      }
    } catch (error) {
      setError('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
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
          <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ color: styles.neutral600, marginTop: '1rem' }}>Loading reports...</p>
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
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <section style={{ 
        background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryDark})`, 
        color: styles.white, 
        padding: '4rem 1rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Reports
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            Annual reports, financials, and impact documentation
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>No reports available.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {reports.map((report) => {
                // Check if there's a file URL in the data
                const fileUrl = report.data?.file || report.data?.fileUrl;
                const hasFile = fileUrl && fileUrl.startsWith('/uploads/');
                
                return (
                  <div
                    key={report._id}
                    style={{
                      background: styles.white,
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: `1px solid ${styles.neutral200}`,
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      transition: 'box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      {report.title && (
                        <h3 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: 'bold', 
                          color: styles.primary,
                          marginBottom: '0.25rem',
                        }}>
                          {report.title}
                        </h3>
                      )}
                      {report.content && (
                        <p style={{ 
                          color: styles.neutral600, 
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                        }}>
                          {report.content}
                        </p>
                      )}
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}>
                        <FaCalendarAlt size={12} />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {hasFile ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.5rem 1.25rem',
                            background: styles.primary,
                            color: styles.white,
                            textDecoration: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = styles.primaryDark;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = styles.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <FaFilePdf size={16} />
                          Download
                        </a>
                      ) : (
                        <span style={{
                          padding: '0.5rem 1.25rem',
                          background: styles.neutral100,
                          color: styles.neutral600,
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}>
                          <FaFileAlt size={16} />
                          No file
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
