import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.amplifyhopeafrica.org'),
  title: {
    default: 'Amplify Hope Africa | Empowering Communities',
    template: '%s | Amplify Hope Africa',
  },
  description: 'Amplify Hope Africa is a Kenyan NGO empowering children, women, and youth through education, health, livelihoods, and mentorship programs across Nairobi, Kisumu, Siaya, Kisii, and Homa Bay.',
  keywords: 'NGO Kenya, community empowerment, education, health, livelihoods, mentorship, youth development, women empowerment',
  authors: [{ name: 'Amplify Hope Africa' }],
  creator: 'Amplify Hope Africa',
  publisher: 'Amplify Hope Africa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Amplify Hope Africa | Empowering Communities',
    description: 'Empowering children, women, and youth across Africa through transformative skills, training, education, and opportunities.',
    url: 'https://www.amplifyhopeafrica.org',
    siteName: 'Amplify Hope Africa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amplify Hope Africa - Empowering Communities',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amplify Hope Africa | Empowering Communities',
    description: 'Empowering children, women, and youth across Africa.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.amplifyhopeafrica.org',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
