export default function DonatePage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    secondary: '#D4AF37',
    white: '#FFFFFF',
    neutral50: '#F9FAFB',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
  }

  return (
    <main>
      <section style={{ background: `linear-gradient(to bottom right, ${styles.primary}, ${styles.primaryDark})`, color: styles.white, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Support Our Mission</h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, marginTop: '1rem' }}>
            Your donation helps us empower children, women, and youth across Africa
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>Why Donate?</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: styles.primary, marginBottom: '0.5rem' }}>Your Impact</h3>
                <p style={{ color: styles.neutral600 }}>
                  Every contribution helps us reach more communities with life-changing programs in education, health, livelihoods, and protection.
                </p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: styles.primary, marginBottom: '0.5rem' }}>Transparency</h3>
                <p style={{ color: styles.neutral600 }}>
                  We are committed to transparency and accountability. View our reports and financials to see how your donations make a difference.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: styles.primary, marginBottom: '0.5rem' }}>Our Reach</h3>
                <p style={{ color: styles.neutral600 }}>
                  Currently serving over 20,000 youth and women across Nairobi, Kisumu, Siaya, Kisii, and Homabay counties.
                </p>
              </div>
            </div>

            <div style={{ background: styles.neutral50, padding: '2rem', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1.5rem' }}>Make a Donation</h2>
              <div style={{ background: styles.white, padding: '1rem', borderRadius: '0.5rem', border: `2px solid ${styles.primary}` }}>
                <p style={{ fontSize: '0.875rem', color: styles.neutral600 }}>Partner with us through GlobalGiving</p>
                <a
                  href="https://www.globalgiving.org/projects/youth-skill-up-training-on-renewable-energy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', width: '100%', textAlign: 'center', marginTop: '0.75rem', padding: '0.75rem 1.5rem', background: styles.primary, color: styles.white, fontWeight: 'bold', borderRadius: '0.5rem', textDecoration: 'none' }}
                >
                  Donate on GlobalGiving
                </a>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: styles.neutral600, marginTop: '1rem' }}>
                <p>Or contact us directly for other donation options:</p>
                <p style={{ marginTop: '0.5rem', color: styles.primary }}>info@amplifyhopeafrica.org</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.neutral50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1rem' }}>Trust & Transparency</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ padding: '0.5rem 1rem', background: styles.white, borderRadius: '9999px', color: styles.neutral700 }}>Registered NGO</span>
            <span style={{ padding: '0.5rem 1rem', background: styles.white, borderRadius: '9999px', color: styles.neutral700 }}>GlobalGiving Partner</span>
            <span style={{ padding: '0.5rem 1rem', background: styles.white, borderRadius: '9999px', color: styles.neutral700 }}>Kenyan Changemakers</span>
          </div>
        </div>
      </section>
    </main>
  )
}
