'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Content', href: '/admin/content' },
  { name: 'Team', href: '/admin/team' },
  { name: 'Gallery', href: '/admin/gallery' },
  { name: 'Forms', href: '/admin/forms' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <SessionProvider>
        <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
          {children}
        </div>
      </SessionProvider>
    );
  }

  const sidebarWidth = isMobile ? '120px' : '250px';
  const paddingSize = isMobile ? '0.75rem' : '1.5rem';
  const fontSize = isMobile ? '0.7rem' : '0.95rem';
  const logoFontSize = isMobile ? '0.9rem' : '1.25rem';
  const navPadding = isMobile ? '0.5rem 0.4rem' : '0.75rem 1rem';

  return (
    <SessionProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarWidth,
          background: '#1A5D3C',
          color: 'white',
          padding: paddingSize,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: 'auto',
          zIndex: 50,
          transition: 'width 0.3s ease, padding 0.3s ease',
        }}>
          <div style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
            <h1 style={{
              fontSize: logoFontSize,
              fontWeight: 'bold',
              wordBreak: 'break-word',
              lineHeight: '1.2',
              marginBottom: isMobile ? '0.25rem' : '0.5rem',
            }}>
              Amplify Hope
            </h1>
            {!isMobile && (
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                Admin Panel
              </p>
            )}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const displayName = isMobile ? item.name.substring(0, 8) : item.name;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.name}
                  style={{
                    display: 'block',
                    padding: navPadding,
                    borderRadius: '0.375rem',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    fontSize: fontSize,
                    textAlign: isMobile ? 'center' : 'left',
                    wordBreak: 'break-word',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {displayName}
                </Link>
              );
            })}
          </nav>

          <div style={{
            marginTop: isMobile ? '1rem' : '2rem',
            paddingTop: isMobile ? '1rem' : '2rem',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            position: 'absolute',
            bottom: isMobile ? '1rem' : '2rem',
            left: paddingSize,
            right: paddingSize,
          }}>
            <Link
              href="/api/auth/signout"
              title="Logout"
              style={{
                display: 'block',
                padding: navPadding,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.375rem',
                fontSize: fontSize,
                textAlign: isMobile ? 'center' : 'left',
                wordBreak: 'break-word',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {isMobile ? 'Logout' : 'Logout'}
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{
          marginLeft: sidebarWidth,
          flex: 1,
          background: '#F9FAFB',
          minHeight: '100vh',
          padding: '2rem',
          transition: 'margin-left 0.3s ease',
        }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
