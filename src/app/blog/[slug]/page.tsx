'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  section: string;
  images: string[];
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/public/content?page=blog`);
      const data = await res.json();
      if (data.success) {
        const found = data.data.find((p: any) => p._id === params.slug);
        if (found) {
          setPost(found);
        } else {
          setError('Post not found');
        }
      } else {
        setError('Failed to load post');
      }
    } catch (error) {
      setError('Error loading post');
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
          <p style={{ color: styles.neutral600 }}>Loading post...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>
          <p>{error || 'Post not found'}</p>
          <button
            onClick={() => router.push('/blog')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: styles.primary,
              color: styles.white,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Back to Blog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '5rem' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Post Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
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
            <span style={{ fontSize: '0.875rem', color: styles.neutral600 }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          {post.title && (
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: styles.primary,
              marginBottom: '1rem',
            }}>
              {post.title}
            </h1>
          )}
        </div>

        {/* Featured Image */}
        {post.images && post.images.length > 0 && (
          <div style={{
            height: '300px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            marginBottom: '2rem',
            background: styles.neutral100,
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

        {/* Post Content */}
        {post.content && (
          <div style={{ 
            color: styles.neutral700, 
            lineHeight: '1.8',
            fontSize: '1.125rem',
          }}>
            <p>{post.content}</p>
          </div>
        )}

        {/* Back Button */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${styles.neutral200}` }}>
          <button
            onClick={() => router.push('/blog')}
            style={{
              padding: '0.5rem 1.5rem',
              background: styles.neutral100,
              color: styles.neutral700,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = styles.neutral200}
            onMouseLeave={(e) => e.currentTarget.style.background = styles.neutral100}
          >
            ← Back to Blog
          </button>
        </div>
      </article>
    </main>
  );
}
