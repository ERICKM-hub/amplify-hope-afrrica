'use client';

import { useState } from 'react';

export default function GetInvolvedPage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    secondary: '#D4AF37',
    white: '#FFFFFF',
    neutral50: '#F9FAFB',
    neutral100: '#F3F4F6',
    neutral200: '#E5E7EB',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
    green50: '#F0FDF4',
    green700: '#15803D',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'volunteer',
    gender: '',
    country: '',
    message: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const res = await fetch('/api/get-involved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: 'volunteer',
          gender: '',
          country: '',
          message: '',
          consent: false,
        });
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      setError('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        background: `linear-gradient(135deg, ${styles.primary}, ${styles.primaryDark})`, 
        color: styles.white, 
        padding: '4rem 1rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Get Involved
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            Join us in empowering communities across Africa
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1rem' }}>
              How You Can Help
            </h2>
            <p style={{ color: styles.neutral600 }}>
              By joining us, you are becoming part of a collective effort to empower communities and create sustainable growth.
            </p>
          </div>

          {submitted ? (
            <div style={{ 
              background: styles.green50, 
              border: `2px solid ${styles.green700}`, 
              color: styles.green700, 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              textAlign: 'center',
            }}>
              
              <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Thank you for your interest!</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>We'll be in touch with you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ 
              background: styles.neutral50, 
              padding: '2rem', 
              borderRadius: '0.75rem',
              border: `1px solid ${styles.neutral200}`,
            }}>
              {error && (
                <div style={{ 
                  background: '#FEE2E2', 
                  color: '#991B1B', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.375rem', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  ❌ {error}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="interest" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                  I'm interested in *
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  value={formData.interest}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
                >
                  <option value="volunteer">Volunteering</option>
                  <option value="partner">Partnering (Organization)</option>
                  <option value="sponsor">Corporate Sponsorship</option>
                  <option value="donate">Donating</option>
                  <option value="other">Other</option>
                </select>
              </div>

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
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
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
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="gender" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="country" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                  Country of Origin
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: styles.neutral700, marginBottom: '0.25rem' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem 1rem', 
                    border: `1px solid ${styles.neutral200}`,
                    borderRadius: '0.375rem',
                    background: styles.white,
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  style={{ marginTop: '0.25rem', marginRight: '0.75rem', width: '1rem', height: '1rem' }}
                />
                <label htmlFor="consent" style={{ fontSize: '0.875rem', color: styles.neutral600 }}>
                  I consent to my data being stored and used to respond to my inquiry in accordance with the Privacy Policy.*
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#9CA3AF' : styles.primary,
                  color: styles.white,
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = styles.primaryDark;
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = styles.primary;
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
