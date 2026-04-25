'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AdminDashboardProps {
  onBack: () => void
}

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'

interface TopicRow { label: string; count: number; pct: number }
interface StatsRow { label: string; value: string; sub: string }

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [barsVis, setBarsVis] = useState(false)
  const [hovRow, setHovRow] = useState<number | null>(null)
  const [chartData, setChartData] = useState<TopicRow[]>([])
  const [stats, setStats] = useState<StatsRow[]>([
    { label: 'Total Queries', value: '—', sub: 'Loading…' },
    { label: 'Unique Sessions', value: '—', sub: 'Loading…' },
    { label: 'Fallback Rate', value: '—', sub: 'Loading…' },
  ])

  const buildDerived = (rows: { topic?: string | null; 'user-id'?: string | null }[]) => {
    const totalQueries = rows.length
    const uniqueSessions = new Set(rows.map((r) => r['user-id']).filter(Boolean)).size

    const topicCounts: Record<string, number> = {}
    rows.forEach((r) => {
      const t = r.topic?.trim() || 'Undefined'
      topicCounts[t] = (topicCounts[t] || 0) + 1
    })

    const fallbackCount = topicCounts['Undefined'] || 0
    const fallbackRate = totalQueries > 0 ? ((fallbackCount / totalQueries) * 100).toFixed(1) : '0.0'

    const sorted = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)

    const max = sorted[0]?.[1] || 1
    const chart: TopicRow[] = sorted.map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / max) * 100),
    }))

    setChartData(chart)
    setStats([
      { label: 'Total Queries', value: totalQueries.toLocaleString(), sub: 'All time' },
      { label: 'Unique Sessions', value: uniqueSessions.toLocaleString(), sub: 'Distinct users' },
      { label: 'Fallback Rate', value: `${fallbackRate}%`, sub: 'No-answer responses' },
    ])
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('hotel_conversation')
        .select('*')
      if (data) buildDerived(data)
    }

    fetchData()

    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hotel_conversation' }, () => {
        fetchData()
      })
      .subscribe()

    const t = setTimeout(() => setBarsVis(true), 400)

    return () => {
      clearTimeout(t)
      supabase.removeChannel(channel)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setUploadDone(false)
    setUploadError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return
    setIsUploading(true)
    setProgress(0)
    setUploadDone(false)
    setUploadError(null)

    // Animate progress while uploading
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 14
        if (next >= 90) { clearInterval(iv); return 90 }
        return next
      })
    }, 220)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/admin/upload-hotel-info', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      clearInterval(iv)
      setProgress(100)

      if (response.ok) {
        setTimeout(() => {
          setIsUploading(false)
          setUploadDone(true)
          setSelectedFile(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }, 300)
      } else {
        setIsUploading(false)
        setUploadError(result.error || 'Upload failed')
      }
    } catch {
      clearInterval(iv)
      setIsUploading(false)
      setUploadError('Upload failed. Please try again.')
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Apple large-title vibrancy nav */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(18,18,20,0.72)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        padding: '16px 28px 14px', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontSize: '17px', fontFamily: SF,
            fontWeight: 400, padding: '4px 0',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M10 2L2 10L10 18" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lobby
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '12px', color: '#34c759',
            fontFamily: SF, fontWeight: 500,
          }}>
            <span className="pulse-gold" style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#34c759', display: 'inline-block',
            }} />
            Live
          </div>
        </div>
        <div style={{
          fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px',
          color: 'var(--text)', fontFamily: SFD, lineHeight: 1,
        }}>
          Staff Portal
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 32px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {stats.map(({ label, value, sub }) => (
            <div key={label} style={{
              background: 'rgba(28,28,30,0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 16, padding: '18px 16px',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 500,
                color: 'rgba(235,235,245,0.4)', fontFamily: SF,
                letterSpacing: '0.03em', marginBottom: 8, textTransform: 'uppercase',
              }}>
                {label}
              </div>
              <div style={{
                fontSize: '30px', fontWeight: 700, color: 'var(--text)',
                fontFamily: SFD, letterSpacing: '-1px', lineHeight: 1,
              }}>
                {value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: 8, fontFamily: SF }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Upload grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

          {/* Chart */}
          <div style={{
            background: 'rgba(28,28,30,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '24px',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'rgba(235,235,245,0.35)',
              fontFamily: SF, marginBottom: 4,
            }}>
              Conversation Analytics
            </div>
            <div style={{
              fontSize: '20px', fontWeight: 700, color: 'var(--text)',
              fontFamily: SFD, letterSpacing: '-0.4px', marginBottom: 20,
            }}>
              Query Topics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {chartData.map(({ label, count, pct }, i) => (
                <div key={label}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{ opacity: hovRow !== null && hovRow !== i ? 0.35 : 1, transition: 'opacity 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text)', fontFamily: SF, fontWeight: 400 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: SF, fontWeight: 600 }}>
                      {count}
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: barsVis ? `${pct}%` : '0%',
                      background: 'var(--accent)',
                      borderRadius: 4,
                      transition: `width 0.85s cubic-bezier(.16,1,.3,1) ${i * 60}ms`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 18, paddingTop: 16,
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              fontSize: '11px', color: 'rgba(235,235,245,0.25)', fontFamily: SF,
            }}>
              Real-time via Supabase · hotel_conversation
            </div>
          </div>

          {/* Upload */}
          <div style={{
            background: 'rgba(28,28,30,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '24px',
            border: '0.5px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'rgba(235,235,245,0.35)',
              fontFamily: SF, marginBottom: 4,
            }}>
              Knowledge Base
            </div>
            <div style={{
              fontSize: '20px', fontWeight: 700, color: 'var(--text)',
              fontFamily: SFD, letterSpacing: '-0.4px', marginBottom: 16,
            }}>
              Upload Hotel Info
            </div>

            <label style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px 12px', marginBottom: 14,
              border: `1px dashed ${selectedFile ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 14,
              background: selectedFile ? 'rgba(214,191,136,0.05)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <>
                  <svg width="32" height="32" viewBox="0 0 34 34" fill="none" style={{ marginBottom: 10 }}>
                    <rect x="7" y="2" width="20" height="30" rx="3" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
                    <path d="M7 10h20" stroke="var(--accent)" strokeWidth="0.7" opacity="0.4" />
                    <text x="17" y="23" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="var(--accent)" fontWeight="600">PDF</text>
                  </svg>
                  <div style={{ fontSize: '12px', color: 'var(--text)', fontFamily: SF, fontWeight: 500, wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(235,235,245,0.35)', marginTop: 3, fontFamily: SF }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </>
              ) : (
                <>
                  <svg width="30" height="28" viewBox="0 0 30 28" fill="none" style={{ marginBottom: 10, opacity: 0.3 }}>
                    <path d="M15 20V8M9 14L15 8L21 14" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 22C2 20 2 16 6 15 6 11 10.5 8 15 9.5 17 6.5 23 7 24 11 27.5 12 28.5 16 26.5 18"
                      stroke="var(--text)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
                  </svg>
                  <div style={{ fontSize: '13px', color: 'rgba(235,235,245,0.45)', fontFamily: SF }}>
                    Drop PDF here
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(235,235,245,0.25)', marginTop: 3, fontFamily: SF }}>
                    or click to browse · Max 50 MB
                  </div>
                </>
              )}
            </label>

            {/* Progress bar */}
            {(isUploading || uploadDone) && (
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  height: 3, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 2, overflow: 'hidden', marginBottom: 6,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    background: 'var(--accent)',
                    borderRadius: 2, transition: 'width 0.2s',
                  }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: uploadDone ? 'var(--accent)' : 'rgba(235,235,245,0.35)',
                  fontFamily: SF,
                }}>
                  {uploadDone ? '✓ Ingested into knowledge base' : `Uploading… ${Math.round(Math.min(progress, 100))}%`}
                </div>
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div style={{ fontSize: '12px', color: '#ff453a', marginBottom: 10, fontFamily: SF }}>
                {uploadError}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              style={{
                padding: '13px',
                background: !selectedFile || isUploading ? 'rgba(44,44,46,0.6)' : 'var(--accent)',
                border: 'none', borderRadius: 12,
                color: !selectedFile || isUploading ? 'rgba(235,235,245,0.25)' : 'var(--bg)',
                fontSize: '14px', fontWeight: 600, fontFamily: SF,
                cursor: !selectedFile || isUploading ? 'default' : 'pointer',
                transition: 'all 0.18s', letterSpacing: '-0.1px',
              }}
            >
              {isUploading ? 'Uploading…' : uploadDone ? 'Upload Another' : 'Upload & Ingest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
