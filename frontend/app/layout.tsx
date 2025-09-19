import './globals.css'
import { Inter } from 'next/font/google'
import { VoiceProvider } from './providers/VoiceProvider'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dante Voice Chip - Terminal Control Tower',
  description: 'Monitor your terminal activity with voice interaction and AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VoiceProvider>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                {children}
              </main>
            </div>
          </div>
        </VoiceProvider>
      </body>
    </html>
  )
}