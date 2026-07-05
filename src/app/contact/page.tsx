'use client'

import { useState } from 'react'

export default function ContactPage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    white: '#FFFFFF',
    neutral50: '#F9FAFB',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
    green50: '#F0FDF4',
    green700: '#15803D',
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main>
      <section style={{ background: `linear-gradient(to bottom right, ${styles.primary}, ${styles.primaryDark})`, color: styles.white, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Contact Us</h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, marginTop: '1rem' }}>Get in touch with us for partnerships, volunteering, or any questions</p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>Get in Touch</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', color: styles.neutral800 }}>Email</h3>
                  <p style={{ color: styles.neutral600 }}>info@amplifyhopeafrica.org</p>
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: styles.neutral800 }}>Phone</h3>
                  <p style={{ color: styles.neutral600 }}>+254 700 000 000</p>
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: styles.neutral800 }}>Location</h3>
                  <p style={{ color: styles.neutral600 }}>Nairobi, Kenya</p>
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', color: styles.neutral800 }}>Working Hours</h3>
                  <p style={{ color: styles.neutral600 }}>Mon-Fri: 8:00 AM - 5:00 PM EAT</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>Send Us a Message</h2>
              {submitted ? (
                <div style={{ background: styles.green50, border: `1px solid ${styles.green700}`, color: styles.green700, padding: '1.5rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontWeight: 'bold' }}>Thank you for your message!</p>
                  <p style={{ fontSize: '0.875rem' }}>We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: styles.neutral50, padding: '2rem', borderRadius: '0.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.5rem 1rem', border: `1px solid #D1D5DB`, borderRadius: '0.5rem' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.5rem 1rem', border: `1px solid #D1D5DB`, borderRadius: '0.5rem' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="subject" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.5rem 1rem', border: `1px solid #D1D5DB`, borderRadius: '0.5rem' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.5rem 1rem', border: `1px solid #D1D5DB`, borderRadius: '0.5rem' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '0.75rem 1.5rem', background: styles.primary, color: styles.white, fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
