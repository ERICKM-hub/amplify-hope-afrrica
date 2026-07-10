'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  content: number;
  forms: number;
  team: number;
  newForms: number;
  total: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Get the admin's full name
  const adminName = session?.user?.name || 'Admin';

  const statItems = [
    { label: 'Content Pages', value: stats?.content || 0, href: '/admin/content' },
    { label: 'Form Submissions', value: stats?.forms || 0, href: '/admin/forms' },
    { label: 'Team Members', value: stats?.team || 0, href: '/admin/team' },
    { label: 'New Forms', value: stats?.newForms || 0, href: '/admin/forms' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1A5D3C',
            margin: 0,
          }}>
            Welcome back, {adminName}!
          </h1>
          <p style={{ 
            color: '#6B7280', 
            margin: 0,
            fontSize: '0.95rem',
          }}>
            Here is what is happening with your website
          </p>
        </div>
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#6B7280',
          marginTop: '0.25rem',
        }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {statItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              background: 'white',
              padding: '1.25rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'block',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#1A5D3C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1A5D3C',
              marginBottom: '0.25rem',
            }}>
              {item.value}
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6B7280',
              margin: 0,
            }}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '1.5rem',
      }}>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#1F2937',
          }}>
            Quick Actions
          </h2>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem',
          }}>
            <Link
              href="/admin/content/new"
              style={{
                padding: '0.75rem 1rem',
                background: '#1A5D3C',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.375rem',
                textAlign: 'center',
                transition: 'background 0.2s',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0F3D27';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1A5D3C';
              }}
            >
              Add New Content
            </Link>
            <Link
              href="/admin/team/new"
              style={{
                padding: '0.75rem 1rem',
                background: 'white',
                color: '#1A5D3C',
                textDecoration: 'none',
                borderRadius: '0.375rem',
                border: '1px solid #1A5D3C',
                textAlign: 'center',
                transition: 'background 0.2s, color 0.2s',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1A5D3C';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#1A5D3C';
              }}
            >
              Add Team Member
            </Link>
            <Link
              href="/admin/gallery/new"
              style={{
                padding: '0.75rem 1rem',
                background: 'white',
                color: '#1A5D3C',
                textDecoration: 'none',
                borderRadius: '0.375rem',
                border: '1px solid #1A5D3C',
                textAlign: 'center',
                transition: 'background 0.2s, color 0.2s',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1A5D3C';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#1A5D3C';
              }}
            >
              Add Gallery Image
            </Link>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#1F2937',
          }}>
            Recent Activity
          </h2>
          <p style={{ 
            color: '#6B7280', 
            fontSize: '0.875rem',
            margin: 0,
          }}>
            No recent activity yet.
          </p>
        </div>
      </div>
    </div>
  );
}
