'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LandingPage from '@/components/landing-page'
import AdminDashboard from '@/components/admin-dashboard'
import UserChat from '@/components/user-chat'

export default function Home() {
  const [mode, setMode] = useState<null | 'admin' | 'user'>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleModeChange = (newMode: 'admin' | 'user' | null) => {
    if (newMode !== mode) {
      setIsTransitioning(true)
      setTimeout(() => {
        setMode(newMode)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const currentComponent = () => {
    if (mode === 'admin') {
      return <AdminDashboard onBack={() => handleModeChange(null)} />
    }

    if (mode === 'user') {
      return <UserChat onBack={() => handleModeChange(null)} />
    }

    return <LandingPage onSelectMode={handleModeChange} />
  }

  return (
    <div className="relative w-full h-screen">
      <div
        className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
          isTransitioning
            ? 'opacity-0'
            : 'opacity-100'
        }`}
      >
        {currentComponent()}
      </div>
    </div>
  )
}
