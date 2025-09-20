import { createClient } from '@/utils/supabase/server'

/**
 * Notes Component - Ubuntu Excellence Edition
 * Based on your original pattern with cultural enhancements
 */
export default async function Notes() {
  const supabase = await createClient()
  const { data: notes, error } = await supabase.from("notes").select()

  // Ubuntu-styled error handling
  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '20px auto', 
        padding: '20px',
        border: '2px solid #DC143C',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        color: '#f7fafc'
      }}>
        <h2 style={{ color: '#DC143C', marginBottom: '10px' }}>
          🔧 Ubuntu Connection Challenge
        </h2>
        <p style={{ marginBottom: '10px' }}>
          🌍 "I am because we are" - Database connection needs Ubuntu guidance
        </p>
        <pre style={{ 
          fontSize: '12px', 
          color: '#FFD700',
          backgroundColor: '#2d3748',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  // Ubuntu-styled empty state
  if (!notes || notes.length === 0) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '20px auto', 
        padding: '20px',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        color: '#f7fafc',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#FFD700', marginBottom: '10px' }}>
          📝 Ubuntu Notes Collection
        </h2>
        <p>🌱 "Every great journey begins with a single step" - Your first note awaits!</p>
      </div>
    )
  }

  // Ubuntu-enhanced display (your original format + styling)
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: '#f7fafc',
      borderRadius: '8px'
    }}>
      {/* Ubuntu Header */}
      <div style={{
        border: '2px solid #FFD700',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #1a1a1a, #2d3748)'
      }}>
        <h1 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>
          🌍 Ubuntu Notes Collection ({notes.length} notes)
        </h1>
        <p style={{ margin: 0, fontSize: '14px' }}>
          🎼 "I am because we are" - Our shared knowledge grows through collective wisdom
        </p>
      </div>

      {/* Your Original Debug Display */}
      <div style={{
        border: '1px solid #228B22',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        backgroundColor: '#2d3748'
      }}>
        <h3 style={{ color: '#228B22', marginTop: 0 }}>
          📊 Notes Data (Your Original Format)
        </h3>
        <pre style={{ 
          margin: 0,
          fontSize: '12px',
          lineHeight: '1.4',
          overflow: 'auto',
          maxHeight: '400px',
          color: '#a9b1d6'
        }}>
          {JSON.stringify(notes, null, 2)}
        </pre>
      </div>

      {/* Enhanced Display */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#228B22', marginBottom: '15px' }}>
          📋 Ubuntu Formatted Notes
        </h3>
        {notes.map((note: any, index: number) => (
          <div 
            key={note.id || index}
            style={{
              border: '1px solid #228B22',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '6px',
              backgroundColor: '#2d3748'
            }}
          >
            {note.title && (
              <h4 style={{ color: '#FFD700', margin: '0 0 8px 0' }}>
                {note.title}
              </h4>
            )}
            {note.content && (
              <p style={{ margin: '0 0 8px 0', whiteSpace: 'pre-wrap' }}>
                {note.content}
              </p>
            )}
            {note.created_at && (
              <div style={{ 
                fontSize: '11px', 
                color: '#4682B4',
                borderTop: '1px solid #4a5568',
                paddingTop: '8px'
              }}>
                📅 Created: {new Date(note.created_at).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ubuntu Footer */}
      <div style={{
        textAlign: 'center',
        padding: '10px',
        border: '1px solid #CD7F32',
        borderRadius: '6px',
        backgroundColor: '#2d3748'
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#CD7F32' }}>
          🎯 Ubuntu Excellence: Knowledge shared is wisdom multiplied
        </p>
      </div>
    </div>
  )
}