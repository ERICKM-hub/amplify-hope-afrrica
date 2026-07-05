export default function TeamPage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    primaryLight: '#2D7D52',
    white: '#FFFFFF',
    neutral600: '#4B5563',
  }

  return (
    <main>
      <section style={{ background: `linear-gradient(to bottom right, ${styles.primary}, ${styles.primaryDark})`, color: styles.white, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Our Team</h1>
          <p style={{ fontSize: '1.25rem', color: styles.primaryLight, marginTop: '1rem' }}>The passionate individuals behind Amplify Hope Africa</p>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: styles.neutral600, fontSize: '1.125rem' }}>Team member profiles coming soon...</p>
          
        </div>
      </section>
    </main>
  )
}
