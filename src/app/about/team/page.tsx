'use client';

import { useEffect, useState } from 'react';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook,
  FaSpinner,
  FaUser
} from 'react-icons/fa';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isActive: boolean;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/public/team');
      const data = await res.json();
      
      if (data.success) {
        setMembers(data.data || []);
      } else {
        setError('Failed to load team members');
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      setError('Error loading team members');
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
    neutral400: '#9CA3AF',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
    neutral900: '#111827',
  };

  if (loading) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ color: styles.neutral600, marginTop: '1rem' }}>Loading team members...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
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
      {/* Hero Banner */}
      <section style={{ 
        background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryDark})`, 
        color: styles.white, 
        padding: '4rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Our Team
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            The passionate individuals behind Amplify Hope Africa
          </p>
          {members.length > 0 && (
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
              {members.length} team members
            </p>
          )}
        </div>
      </section>

      {/* Team Grid - Cards */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>No team members found.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem',
            }}>
              {members.map((member) => (
                <div
                  key={member._id}
                  style={{
                    background: styles.white,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    border: `1px solid ${styles.neutral200}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Profile Image - h-25, w-auto, rounded-full, py-2 */}
                  <div style={{
                    height: '6.25rem', // h-25 = 6.25rem (100px)
                    width: 'auto',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: styles.neutral100,
                    padding: '0.5rem 0', // py-2 = 0.5rem
                    flexShrink: 0,
                  }}>
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        style={{ 
                          height: '100%',
                          width: 'auto',
                          objectFit: 'cover',
                          borderRadius: '9999px',
                        }} 
                      />
                    ) : (
                      <FaUser size={40} color={styles.neutral400} />
                    )}
                  </div>
                  
                  <div style={{ 
                    padding: '1rem 0 0 0', 
                    textAlign: 'center',
                    width: '100%',
                  }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: styles.primary,
                      marginBottom: '0.25rem',
                    }}>
                      {member.name}
                    </h3>
                    <p style={{ 
                      color: styles.primaryLight, 
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                    }}>
                      {member.role}
                    </p>
                    {member.bio && (
                      <p style={{ 
                        color: styles.neutral600, 
                        fontSize: '0.875rem', 
                        lineHeight: '1.6',
                        marginBottom: '1rem',
                      }}>
                        {member.bio}
                      </p>
                    )}
                    {/* Social Links */}
                    {(member.socialLinks?.linkedin || member.socialLinks?.twitter || member.socialLinks?.facebook) && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        {member.socialLinks.linkedin && (
                          <a 
                            href={member.socialLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#0A66C2',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.875rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <FaLinkedin size={18} />
                            LinkedIn
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a 
                            href={member.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1DA1F2',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.875rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <FaTwitter size={18} />
                            Twitter
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a 
                            href={member.socialLinks.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1877F2',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.875rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <FaFacebook size={18} />
                            Facebook
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
