import Notes from '@/components/Notes'

/**
 * Notes Page - Ubuntu Excellence
 * Demonstrates Supabase integration with server-side rendering
 */
export default function NotesPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      padding: '20px'
    }}>
      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        borderBottom: '2px solid #FFD700'
      }}>
        <h1 style={{ 
          color: '#FFD700', 
          fontSize: '2.5rem',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          🌍 Dante Voice Chip Notes
        </h1>
        <p style={{ 
          color: '#f7fafc',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Ubuntu-powered Supabase integration with server-side rendering
        </p>
      </div>

      {/* Notes Component */}
      <Notes />

      {/* Page Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        borderTop: '1px solid #2d3748',
        color: '#a9b1d6',
        fontSize: '14px'
      }}>
        <p style={{ margin: 0 }}>
          🎼 "I am because we are" - Built with Ubuntu philosophy and technical excellence
        </p>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Notes - Dante Voice Chip',
  description: 'Ubuntu-powered notes with Supabase integration',
}