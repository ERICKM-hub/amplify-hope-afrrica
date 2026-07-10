'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {/* Only show Header on non-admin pages */}
      {!isAdminRoute && <Header />}
      
      <main className={!isAdminRoute ? "pt-16 md:pt-20" : ""}>
        {children}
      </main>
      
      {/* Only show Footer on non-admin pages */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
