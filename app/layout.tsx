import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, EB_Garamond, Cinzel, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-cinzel',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Cincinnati Hotel',
  description: 'Where every detail whispers luxury, and every guest arrives as family.',
  icons: {
    icon: [
      { url: '/hotel-logo.png', media: '(prefers-color-scheme: light)' },
      { url: '/hotel-logo.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/hotel-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${ebGaramond.variable} ${cinzel.variable} ${dmSans.variable}`}
    >
      <body className="antialiased grain">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
