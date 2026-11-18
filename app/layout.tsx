import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RJProject — Plan Better. Work Smarter.',
    template: '%s · RJProject',
  },
  description: 'Plan projects, organize tasks, and move your team forward in one focused workspace.',
  applicationName: 'RJProject',
  keywords: ['project management', 'team collaboration', 'task management'],
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#090B12',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
