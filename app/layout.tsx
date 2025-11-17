import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Cincinnati Hotel',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/hotel-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/hotel-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
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
    <html lang="en" className={`${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className={`font-montserrat antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
