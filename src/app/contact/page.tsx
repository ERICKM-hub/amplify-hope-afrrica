'use client';

import { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';

interface Settings {
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({
    contact_email: 'info@amplifyhopeafrica.org',
    contact_phone: '+254 700 000 000',
    address: 'Nairobi, Kenya',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/public/settings');
      const data = await res.json();
      if (data.success) {
        const settingsMap: Record<string, string> = {};
        data.data.forEach((s: any) => {
          settingsMap[s.key] = s.value;
        });
        setSettings({
          contact_email: settingsMap.contact_email || 'info@amplifyhopeafrica.org',
          contact_phone: settingsMap.contact_phone || '+254 700 000 000',
          address: settingsMap.address || 'Nairobi, Kenya',
          facebook: settingsMap.facebook || '',
          twitter: settingsMap.twitter || '',
          instagram: settingsMap.instagram || '',
          linkedin: settingsMap.linkedin || '',
          youtube: settingsMap.youtube || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Error sending message. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    neutral300: '#D1D5DB',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
    green50: '#F0FDF4',
    green700: '#15803D',
    red500: '#EF4444',
  };

  const socialLinks = [
    { key: 'facebook', icon: FaFacebook, color: '#1877F2', label: 'Facebook' },
    { key: 'twitter', icon: FaTwitter, color: '#1DA1F2', label: 'Twitter' },
    { key: 'instagram', icon: FaInstagram, color: '#E4405F', label: 'Instagram' },
    { key: 'linkedin', icon: FaLinkedin, color: '#0A66C2', label: 'LinkedIn' },
    { key: 'youtube', icon: FaYoutube, color: '#FF0000', label: 'YouTube' },
  ];

  const contactInfo = [
    { key: 'email', icon: FaEnvelope, value: settings.contact_email, label: 'Email' },
    { key: 'phone', icon: FaPhone, value: settings.contact_phone, label: 'Phone' },
    { key: 'address', icon: FaMapMarkerAlt, value: settings.address, label: 'Location' },
  ];

  if (loading) {
    return (
      <main style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'inline-block' }}>
            <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p style={{ color: styles.neutral600, marginTop: '1rem' }}>Loading...</p>
        </div>
      </main>
    );
  }

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
            Contact Us
          </h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, maxWidth: '600px', margin: '0 auto' }}>
            Get in touch with us for partnerships, volunteering, or any questions
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '3rem',
            alignItems: 'start',
          }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>
                Get in Touch
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {contactInfo.map((item) => {
                  if (!item.value) return null;
                  const Icon = item.icon;
                  return (
                    <div key={item.key} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '1rem',
                      padding: '1rem',
                      background: styles.neutral50,
                      borderRadius: '0.5rem',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        background: styles.primary,
                        color: styles.white,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: '600', color: styles.neutral800, fontSize: '0.875rem' }}>{item.label}</h3>
                        <p style={{ color: styles.neutral600 }}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              {socialLinks.some(s => settings[s.key as keyof Settings]) && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontWeight: '600', color: styles.neutral800, marginBottom: '0.75rem' }}>Follow Us</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {socialLinks.map(({ key, icon: Icon, color, label }) => {
                      const url = settings[key as keyof Settings];
                      if (!url) return null;
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: 'white',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            background: color,
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.85';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Icon size={16} />
                          {label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>
                Send Us a Message
              </h2>
              {submitted ? (
                <div style={{ 
                  background: styles.green50, 
                  border: `2px solid ${styles.green700}`, 
                  color: styles.green700, 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  textAlign: 'center',
                }}>
                  <FaCheckCircle size={48} style={{ margin: '0 auto', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Thank you for your message!</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>We will get back to you within 24-48 hours.</p>
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
                      <span style={{ fontSize: '1.25rem' }}>!</span>
                      {error}
                    </div>
                  )}
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
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = styles.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = styles.neutral200}
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
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = styles.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = styles.neutral200}
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
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem 1rem', 
                        border: `1px solid ${styles.neutral200}`,
                        borderRadius: '0.375rem',
                        background: styles.white,
                        fontSize: '1rem',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = styles.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = styles.neutral200}
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
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem 1rem', 
                        border: `1px solid ${styles.neutral200}`,
                        borderRadius: '0.375rem',
                        background: styles.white,
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = styles.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = styles.neutral200}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      background: submitLoading ? '#9CA3AF' : styles.primary,
                      color: styles.white,
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: submitLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!submitLoading) e.currentTarget.style.background = styles.primaryDark;
                    }}
                    onMouseLeave={(e) => {
                      if (!submitLoading) e.currentTarget.style.background = styles.primary;
                    }}
                  >
                    {submitLoading ? (
                      <>
                        <FaSpinner size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
