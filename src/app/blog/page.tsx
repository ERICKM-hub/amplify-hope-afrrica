'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  page: string;
  section: string;
  images: string[];
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/public/content?page=blog');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (error) {
      setError('Error loading blog posts');
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
    neutral800: '#1F2937',
  };

  if (loading) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: styles.neutral600 }}>Loading blog posts...</p>
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
      {/* Hero Banner */}
      <section style={{ 
        background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryDark})`, 
        color: styles.white, 
        padding: '4rem 1rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Stories & Updates
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            News and stories from the communities we serve
          </p>
        </div>
      </section>

      {/* Blog Cards */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>No blog posts available.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
              gap: '2rem',
            }}>
              {posts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    background: styles.white,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    border: `1px solid ${styles.neutral200}`,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                >
                  {post.images && post.images.length > 0 && (
                    <div style={{
                      height: '200px',
                      background: styles.neutral100,
                      overflow: 'hidden',
                    }}>
                      <img 
                        src={post.images[0]} 
                        alt={post.title || 'Blog post'} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }} 
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: styles.primary, 
                        background: '#DBEAFE',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                      }}>
                        {post.section || 'General'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: styles.neutral600 }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {post.title && (
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        color: styles.primary,
                        marginBottom: '0.75rem',
                      }}>
                        {post.title}
                      </h2>
                    )}
                    {post.content && (
                      <p style={{ 
                        color: styles.neutral600, 
                        lineHeight: '1.6',
                        fontSize: '0.95rem',
                      }}>
                        {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                      </p>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                      <Link 
                        href={`/blog/${post._id}`}
                        style={{ 
                          color: styles.primary, 
                          fontWeight: '500',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        Read More →
                      </Link>
                    </div>
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
