import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Amplify Hope Africa | Empowering Communities',
  description: 'Empowering children, women, and youth across Africa through transformative skills, training, education, and opportunities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
