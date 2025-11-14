'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LandingPage from '@/components/landing-page'
import AdminDashboard from '@/components/admin-dashboard'
import UserChat from '@/components/user-chat'

export default function Home() {
  const [mode, setMode] = useState<null | 'admin' | 'user'>(null)

  if (mode === 'admin') {
    return <AdminDashboard onBack={() => setMode(null)} />
  }

  if (mode === 'user') {
    return <UserChat onBack={() => setMode(null)} />
  }

  return <LandingPage onSelectMode={setMode} />
}
