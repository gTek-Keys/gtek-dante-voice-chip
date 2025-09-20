import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { VoiceProvider } from './providers/VoiceProvider'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Dante Voice Chip - Terminal Control Tower',
  description: 'AI-powered terminal monitoring with Afrocentric excellence - Monitor your terminal activity with voice interaction and AI-powered insights',
  keywords: ['terminal', 'monitoring', 'ai', 'voice', 'dashboard', 'afrocentric'],
}

export const viewport = {
  themeColor: '#FFD700',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className={`
        ${inter.className} 
        bg-gradient-african 
        min-h-screen 
        text-interface-mist 
        font-sans 
        antialiased
      `}>
        <div className="min-h-screen bg-african-midnight/95 backdrop-blur-sm">
          {/* Pan-African Header Banner */}
          <div className="h-1 bg-gradient-to-r from-african-crimson via-african-gold to-african-emerald"></div>
          
          <VoiceProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-african-midnight/50 p-6 bg-pattern-kente">
                  {children}
                </main>
              </div>
            </div>
          </VoiceProvider>
          
          {/* Cultural Footer Accent */}
          <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-african-emerald via-african-gold to-african-crimson opacity-50"></div>
        </div>
      </body>
    </html>
  )
}