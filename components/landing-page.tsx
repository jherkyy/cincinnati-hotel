'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LandingPageProps {
  onSelectMode: (mode: 'admin' | 'user') => void
}

// Deterministic window-lit pattern (seeded, avoids SSR hydration mismatch)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}
const WINDOW_LIT = Array.from({ length: 63 }, (_, i) => seededRandom(i) > 0.28)

function HotelLogo({ size = 110 }: { size?: number }) {
  const c = 'var(--accent)'
  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M55 4 L102 22 L102 72 C102 99 55 126 55 126 C55 126 8 99 8 72 L8 22 Z"
        stroke={c} strokeWidth="1.2" fill="none" fillOpacity="0.04" />
      <path d="M55 12 L94 27 L94 70 C94 93 55 117 55 117 C55 117 16 93 16 70 L16 27 Z"
        stroke={c} strokeWidth="0.5" fill="none" opacity="0.35" />
      <path d="M55 4 L55 0" stroke={c} strokeWidth="1" opacity="0.5" />
      <circle cx="55" cy="0" r="2" fill={c} opacity="0.7" />
      <circle cx="36" cy="8" r="1.5" fill={c} opacity="0.4" />
      <circle cx="74" cy="8" r="1.5" fill={c} opacity="0.4" />
      <line x1="22" y1="58" x2="88" y2="58" stroke={c} strokeWidth="0.5" opacity="0.3" />
      <path d="M76 33 C70 24 56 21 44 26 C32 31 26 43 28 54"
        stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M76 33 C70 24 56 21 44 26 C32 31 26 43 28 54"
        stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M28 62 C30 73 40 82 53 83 C65 84 75 77 79 67"
        stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M28 62 C30 73 40 82 53 83 C65 84 75 77 79 67"
        stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
      <line x1="76" y1="33" x2="81" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="33" x2="80" y2="37" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="79" y1="67" x2="84" y2="64" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="79" y1="67" x2="83" y2="71" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="92" x2="78" y2="92" stroke={c} strokeWidth="0.5" opacity="0.5" />
      <circle cx="55" cy="92" r="2" fill="none" stroke={c} strokeWidth="0.5" opacity="0.5" />
      <circle cx="32" cy="92" r="1" fill={c} opacity="0.4" />
      <circle cx="78" cy="92" r="1" fill={c} opacity="0.4" />
      <text x="55" y="106" textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="7.5"
        fill={c} letterSpacing="5" fontWeight="400" opacity="0.85">CINCINNATI</text>
      <text x="55" y="117" textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="5.5"
        fill={c} letterSpacing="6" fontWeight="300" opacity="0.55">EST. 1924</text>
      <g opacity="0.25" stroke={c} strokeWidth="0.6">
        <path d="M22 22 L28 22 M22 22 L22 28" />
        <path d="M88 22 L82 22 M88 22 L88 28" />
        <path d="M22 108 L28 108 M22 108 L22 102" />
        <path d="M88 108 L82 108 M88 108 L88 102" />
      </g>
    </svg>
  )
}

function HotelFacade() {
  const cols = 9, rows = 7
  const windows = Array.from({ length: rows * cols }, (_, id) => {
    const r = Math.floor(id / cols)
    const c = id % cols
    return { x: 18 + c * 108, y: 60 + r * 82, lit: WINDOW_LIT[id], id }
  })

  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMax slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg)" />
          <stop offset="60%" stopColor="var(--bg)" />
          <stop offset="100%" stopColor="var(--surface)" />
        </linearGradient>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--surface)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
        <linearGradient id="windowLit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.25" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="40%" stopColor="transparent" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1000" height="700" fill="url(#sky)" />

      {/* Stars */}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={30 + i * 24 + (i % 3) * 8} cy={20 + (i % 7) * 18}
          r={i % 3 === 0 ? 0.8 : 0.5}
          fill="var(--accent)" opacity={0.1 + 0.2 * ((i % 4) / 4)} />
      ))}

      {/* Moon */}
      <circle cx="820" cy="60" r="22" fill="var(--surface)" opacity="0.5" />
      <circle cx="828" cy="54" r="18" fill="var(--bg)" opacity="0.9" />

      {/* Distant city skyline */}
      <g opacity="0.12" fill="var(--surface2)">
        <rect x="0" y="420" width="120" height="280" />
        <rect x="80" y="380" width="60" height="320" />
        <rect x="130" y="440" width="80" height="260" />
        <rect x="780" y="430" width="90" height="270" />
        <rect x="850" y="390" width="65" height="310" />
        <rect x="900" y="450" width="100" height="250" />
      </g>

      {/* Main building body */}
      <rect x="72" y="90" width="856" height="610" fill="url(#bldg)" />
      <rect x="72" y="90" width="20" height="610" fill="var(--bg)" opacity="0.4" />
      <rect x="908" y="90" width="20" height="610" fill="var(--bg)" opacity="0.4" />

      {/* Roof cornice */}
      <rect x="60" y="82" width="880" height="18" fill="var(--surface2)" />
      <rect x="68" y="75" width="864" height="9" fill="var(--border-color)" />
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={80 + i * 37} y="75" width="18" height="9" fill="var(--surface)" opacity="0.7" />
      ))}

      {/* Pediment */}
      <path d="M440 20 L500 65 L560 20 Z" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <path d="M460 40 L500 65 L540 40" fill="none" stroke="var(--accent)" strokeWidth="0.4" opacity="0.2" />
      <circle cx="500" cy="18" r="5" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />
      <circle cx="500" cy="18" r="2" fill="var(--accent)" opacity="0.4" />

      {/* Floor lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="72" y1={100 + i * 78} x2="928" y2={100 + i * 78}
          stroke="var(--border-color)" strokeWidth="0.8" opacity="0.5" />
      ))}

      {/* Pilasters */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={i} x={72 + i * 107} y="90" width="8" height="610"
          fill="var(--surface2)" opacity="0.6" />
      ))}

      {/* Windows */}
      {windows.map(({ x, y, lit, id }) => (
        <g key={id}>
          {lit && (
            <rect x={x - 4} y={y - 4} width="56" height="68" rx="1"
              fill="var(--accent)" opacity="0.06" filter="url(#softglow)" />
          )}
          <rect x={x} y={y} width="48" height="60" rx="1"
            fill={lit ? 'url(#windowLit)' : 'var(--bg)'}
            stroke="var(--border-color)" strokeWidth="0.8" opacity={lit ? 1 : 0.7} />
          <line x1={x + 24} y1={y} x2={x + 24} y2={y + 60} stroke="var(--border-color)" strokeWidth="0.7" opacity="0.6" />
          <line x1={x} y1={y + 30} x2={x + 48} y2={y + 30} stroke="var(--border-color)" strokeWidth="0.7" opacity="0.6" />
          <path d={`M${x + 4},${y + 4} Q${x + 24},${y - 4} ${x + 44},${y + 4}`}
            stroke={lit ? 'var(--accent)' : 'var(--border-color)'} strokeWidth="0.5" fill="none" opacity="0.5" />
          <rect x={x - 2} y={y + 60} width="52" height="4" rx="1" fill="var(--surface2)" opacity="0.5" />
        </g>
      ))}

      {/* Grand entrance arch */}
      <rect x="420" y="500" width="160" height="200" fill="var(--bg)" opacity="0.8" />
      <path d="M420 500 Q500 440 580 500 Z" fill="var(--surface)" opacity="0.9" />
      <path d="M420 500 Q500 440 580 500" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
      <rect x="430" y="530" width="60" height="170" rx="1" fill="var(--surface2)" opacity="0.8" />
      <rect x="510" y="530" width="60" height="170" rx="1" fill="var(--surface2)" opacity="0.8" />
      <line x1="430" y1="615" x2="490" y2="615" stroke="var(--border-color)" strokeWidth="0.5" />
      <line x1="510" y1="615" x2="570" y2="615" stroke="var(--border-color)" strokeWidth="0.5" />
      <circle cx="491" cy="620" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="509" cy="620" r="3" fill="var(--accent)" opacity="0.6" />

      {/* Entrance lanterns */}
      <g filter="url(#glow)">
        <line x1="415" y1="490" x2="415" y2="540" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        <rect x="409" y="488" width="12" height="18" rx="2" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6" />
        <rect x="411" y="490" width="8" height="14" rx="1" fill="var(--accent)" opacity="0.25" />
        <line x1="585" y1="490" x2="585" y2="540" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        <rect x="579" y="488" width="12" height="18" rx="2" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6" />
        <rect x="581" y="490" width="8" height="14" rx="1" fill="var(--accent)" opacity="0.25" />
      </g>

      {/* Entrance awning */}
      <path d="M390 500 L390 530 L610 530 L610 500 Z" fill="var(--surface2)" opacity="0.9" />
      <path d="M388 530 L388 540 L612 540 L612 530 Z" fill="var(--surface)" opacity="0.8" />
      <text x="500" y="519" textAnchor="middle" fontFamily="'Playfair Display', serif"
        fontSize="9" fill="var(--accent)" letterSpacing="3" opacity="0.9">THE CINCINNATI</text>

      {/* Steps */}
      <rect x="380" y="698" width="240" height="8" fill="var(--surface2)" opacity="0.5" />
      <rect x="390" y="693" width="220" height="6" fill="var(--surface2)" opacity="0.4" />
      <rect x="400" y="688" width="200" height="6" fill="var(--surface2)" opacity="0.3" />

      {/* Vignette overlay */}
      <rect width="1000" height="700" fill="url(#vignette)" />
    </svg>
  )
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '15px 0', width: '100%',
        fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
        fontSize: '16px', fontWeight: 600, letterSpacing: '-0.1px',
        cursor: 'pointer', border: 'none',
        borderRadius: '12px', transition: 'all 0.18s ease',
        background: 'var(--accent)',
        color: 'var(--bg)',
        opacity: hov ? 0.82 : 1,
      }}
    >
      {children}
    </button>
  )
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '15px 0', width: '100%',
        fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
        fontSize: '16px', fontWeight: 600, letterSpacing: '-0.1px',
        cursor: 'pointer', border: 'none',
        borderRadius: '12px', transition: 'all 0.18s ease',
        background: 'rgba(120,120,128,0.18)',
        color: 'var(--text)',
        opacity: hov ? 0.78 : 1,
      }}
    >
      {children}
    </button>
  )
}

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'relative', height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'flex-start',
      background: 'var(--bg)', overflow: 'hidden',
      opacity: vis ? 1 : 0, transition: 'opacity 0.7s ease',
    }}>
      {/* Full-bleed hotel facade illustration */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HotelFacade />
      </div>

      {/* Apple-style vibrancy panel — left-anchored */}
      <div style={{
        position: 'relative', zIndex: 2,
        margin: '0 0 0 7%',
        width: '560px',
        background: 'rgba(18,18,20,0.72)',
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        borderRadius: '24px',
        border: '0.5px solid rgba(255,255,255,0.12)',
        padding: '72px 64px 68px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <Image src="/hotel-logo.png" alt="Cincinnati Hotel" width={140} height={140} priority />

        {/* Title group */}
        <div style={{ marginTop: 40, marginBottom: 6 }}>
          <div style={{
            fontSize: '11px', fontWeight: 400, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--accent)',
            fontFamily: 'var(--font-cinzel), "Cinzel", serif',
            marginBottom: 20, opacity: 0.75,
          }}>
            Est. 1924 · Cincinnati, Ohio
          </div>
          <div style={{
            fontSize: '68px', fontWeight: 300, letterSpacing: '-0.5px',
            lineHeight: 1.02, color: 'var(--text)',
            fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif',
          }}>
            The Cincinnati<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--accent)' }}>Hotel</em>
          </div>
        </div>

        {/* Hairline divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0' }}>
          <div style={{ height: '0.5px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M4 0L4.9 3.1L8 4L4.9 4.9L4 8L3.1 4.9L0 4L3.1 3.1Z" fill="var(--accent)" opacity="0.5" />
          </svg>
          <div style={{ height: '0.5px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '20px', color: 'rgba(235,235,245,0.5)',
          fontFamily: 'var(--font-eb-garamond), "EB Garamond", serif',
          fontStyle: 'italic', lineHeight: 1.7, marginBottom: 40, fontWeight: 400,
        }}>
          Where every detail whispers luxury,<br />and every guest arrives as family.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryBtn onClick={() => onSelectMode('user')}>Concierge Chat</PrimaryBtn>
          <SecondaryBtn onClick={() => onSelectMode('admin')}>Staff Portal</SecondaryBtn>
        </div>
      </div>

      {/* Bottom-right caption */}
      <div style={{
        position: 'absolute', bottom: 24, right: 32, zIndex: 3,
        fontFamily: 'var(--font-cinzel), "Cinzel", serif',
        fontSize: '9px', fontWeight: 400,
        color: 'rgba(235,235,245,0.2)', textAlign: 'right',
        lineHeight: 1.8, letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>
        A Legacy of Hospitality · Since 1924
      </div>
    </div>
  )
}
