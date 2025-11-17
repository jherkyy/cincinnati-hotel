'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdminIcon from '@/components/icons/admin-icon'
import GuestIcon from '@/components/icons/guest-icon'
import Image from 'next/image'

interface LandingPageProps {
  onSelectMode: (mode: 'admin' | 'user') => void
}

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="The Cincinnatian Hotel"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        {/* Additional gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src="/hotel-logo.png"
              alt="Cincinnati Hotel Logo"
              width={120}
              height={120}
              className="sm:w-[150px] sm:h-[150px]"
              priority
            />
          </div>
          <h1 className="title-main text-4xl sm:text-6xl md:text-7xl font-light tracking-wide mb-4 text-foreground">
            Cincinnati Hotel
          </h1>
          <div className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-muted-foreground font-light">
            Where Luxury Meets Innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full px-4">
          {/* Admin Card */}
          <Card
            onClick={() => onSelectMode('admin')}
            className="group cursor-pointer bg-black/40 backdrop-blur-md border border-border/50 hover:border-border/60 hover:bg-black/45 transition-all duration-500 p-6 sm:p-8 flex flex-col hover:shadow-2xl hover:shadow-primary/20 relative"
          >
            <div className="relative">
              <div className="mb-6 p-4 bg-primary/5 rounded-lg group-hover:bg-primary/20 transition-all duration-300 w-fit">
                <Image src="/admin-icon.png" alt="administrator-male" width={40} height={40} />
              </div>
              <h2 className="text-2xl font-light mb-3 text-foreground">Admin</h2>
              <p className="text-muted-foreground font-light mb-6 flex-grow">
                Manage hotel information and view analytics dashboard
              </p>
              <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-light">
                <span className="font-bold">Enter Dashboard</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </Card>

          {/* Guest Card */}
          <Card
            onClick={() => onSelectMode('user')}
            className="group cursor-pointer bg-black/40 backdrop-blur-md border border-border/50 hover:border-border/60 hover:bg-black/45 transition-all duration-500 p-6 sm:p-8 flex flex-col hover:shadow-2xl hover:shadow-primary/20 relative"
          >
            <div className="relative">
              <div className="mb-6 p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300 w-fit">
                <Image src="/guest-icon.png" alt="guest-male" width={40} height={40} />
              </div>
              <h2 className="text-2xl font-light mb-3 text-foreground">Guest</h2>
              <p className="text-muted-foreground font-light mb-6 flex-grow">
                Chat with our AI concierge for assistance and information
              </p>
              <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-light">
                <span className="font-bold">Start Chat</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      <footer className="relative z-10 w-full border-t border-border/30 py-6 sm:py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground font-light text-sm uppercase tracking-widest">
            Experience Hospitality Redefined
          </p>
        </div>
      </footer>
    </div>
  )
}
