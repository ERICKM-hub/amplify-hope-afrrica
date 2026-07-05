export default function AboutPage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    secondary: '#D4AF37',
    neutral50: '#F9FAFB',
    neutral100: '#F3F4F6',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral800: '#1F2937',
    neutral900: '#111827',
    white: '#FFFFFF',
  }

  return (
    <main>
      {/* Hero Banner */}
      <section style={{ background: `linear-gradient(to bottom right, ${styles.primary}, ${styles.primaryDark})`, color: styles.white, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>About Us</h1>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: styles.primary, marginBottom: '2rem' }}>Our Story</h2>
          <div style={{ color: styles.neutral700, lineHeight: '1.75', fontSize: '1.125rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              Amplify Hope Africa is a dynamic organisation founded by a group of passionate Kenyan youth who recognized the challenges faced by communities in Kenya. Driven by the desire to bridge the gaps they observed in their own communities, they created the organisation to empower children, women and youth across Africa.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Founded in 2024 by Kenyan changemakers inspired by young women's challenges around menstrual health in Kibera, Amplify Hope Africa formally registered to tackle education, livelihoods, and mentorship.
            </p>
            <p>
              Today, we serve over 20,000 youth and women across multiple counties including Nairobi, Kisumu, Siaya, Kisii and Homabay.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 1rem', background: styles.neutral50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ background: styles.white, padding: '2rem', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1rem' }}>Our Mission</h2>
              <p style={{ color: styles.neutral600 }}>
                Committed to empowering children, women, and youth throughout Africa by providing transformative skills, training, education, and opportunities that foster community peace and cohesion.
              </p>
            </div>
            <div style={{ background: styles.white, padding: '2rem', borderRadius: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: styles.primary, marginBottom: '1rem' }}>Our Vision</h2>
              <p style={{ color: styles.neutral600 }}>
                To inspire and empower children, women, and youth to achieve success and sustainable community growth in order to break the cycle of poverty for future generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: styles.primary, marginBottom: '3rem' }}>Our Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {[
              { title: 'Compassion', desc: 'Compels us to take action to alleviate suffering and promote well-being, creating supportive environments where our people feel valued and cared for.' },
              { title: 'Integrity', desc: 'Builds trust and credibility, both personally and professionally, fostering a culture of respect and responsibility.' },
              { title: 'Collaboration', desc: 'Encourages open communication, mutual respect, and teamwork, leading to innovative solutions and stronger relationships.' },
              { title: 'Equity', desc: 'Actively working to dismantle barriers and ensure that everyone has the support they need to thrive even as we reach out to all.' },
            ].map((value) => (
              <div key={value.title} style={{ background: styles.neutral50, padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: styles.primary, marginBottom: '0.5rem' }}>{value.title}</h3>
                <p style={{ color: styles.neutral600, fontSize: '0.875rem' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section style={{ padding: '4rem 1rem', background: styles.neutral50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: styles.primary, marginBottom: '3rem' }}>Our Approach</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {[
              'Promote access to quality education among children and youth',
              'Provide entrepreneurial and life-skills training and business start-up opportunities',
              'Provide Psychosocial First Aid (PSFA) to vulnerable/affected community members',
              'Support women and youth in achieving economic independence and leadership roles',
              'Increase accountability and service accessibility for local government/policymakers',
              'Reduce risk and vulnerability to climate change; build resilience',
            ].map((item) => (
              <div key={item} style={{ background: styles.white, padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: styles.primary, fontSize: '1.25rem', marginRight: '0.75rem' }}>✓</span>
                <span style={{ color: styles.neutral700 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
