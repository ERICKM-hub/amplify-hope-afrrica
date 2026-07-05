export default function PrivacyPage() {
  const styles = {
    primary: '#1A5D3C',
    primaryDark: '#0F3D27',
    white: '#FFFFFF',
  }

  return (
    <main>
      <section style={{ background: `linear-gradient(to bottom right, ${styles.primary}, ${styles.primaryDark})`, color: styles.white, padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Privacy Policy</h1>
        </div>
      </section>

      <section style={{ padding: '4rem 1rem', background: styles.white }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <p>Privacy policy content coming soon...</p>
        </div>
      </section>
    </main>
  )
}
