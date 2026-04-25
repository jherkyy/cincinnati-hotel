'use client'

import { useState } from 'react'

interface ContactFormProps {
  onSubmit: (data: { name: string; phone: string; email: string }) => Promise<void>
  onClose: () => void
}

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'

export default function ContactForm({ onSubmit, onClose }: ContactFormProps) {
  const [fields, setFields] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!fields.name.trim()) e.name = 'Name is required'
    if (!/^\+?[\d\s\-().]{7,}$/.test(fields.phone)) e.phone = 'Enter a valid phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email address'
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await onSubmit({
        name: fields.name.trim(),
        phone: fields.phone,
        email: fields.email.trim(),
      })
    } catch (err) {
      console.error('Contact form error:', err)
    } finally {
      setLoading(false)
    }
  }

  function setField(k: keyof typeof fields, v: string) {
    setFields((f) => ({ ...f, [k]: v }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const FIELDS: Array<{ k: keyof typeof fields; label: string; type: string; placeholder: string }> = [
    { k: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
    { k: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
    { k: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        borderRadius: '20px',
        border: '0.5px solid rgba(255,255,255,0.12)',
        padding: '32px 28px 28px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'fadeUp 0.3s cubic-bezier(.16,1,.3,1) forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{
              fontSize: '20px', fontWeight: 700, color: 'var(--text)',
              fontFamily: SFD, letterSpacing: '-0.4px',
            }}>
              Personal Assistance
            </div>
            <div style={{
              fontSize: '13px', color: 'rgba(235,235,245,0.45)',
              fontFamily: SF, marginTop: 4, lineHeight: 1.4,
            }}>
              Leave your details and our team will contact you shortly.
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(120,120,128,0.2)',
            border: 'none', cursor: 'pointer',
            color: 'rgba(235,235,245,0.6)',
            fontFamily: SF, fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginLeft: 12, marginTop: 2,
          }}>
            ✕
          </button>
        </div>

        {/* Hairline */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

        <form onSubmit={handleSubmit}>
          {/* Grouped inputs — Apple Settings style */}
          <div style={{
            background: 'rgba(44,44,46,0.6)',
            borderRadius: 12, overflow: 'hidden', marginBottom: 20,
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}>
            {FIELDS.map(({ k, label, type, placeholder }, i) => (
              <div key={k}>
                <div style={{ background: 'rgba(58,58,60,0.0)' }}>
                  <input
                    type={type}
                    placeholder={label}
                    value={fields[k]}
                    onChange={(e) => setField(k, e.target.value)}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'transparent', border: 'none',
                      color: 'var(--text)', fontSize: '16px',
                      fontFamily: SF, outline: 'none',
                    }}
                  />
                </div>
                {errors[k] && (
                  <div style={{
                    fontSize: '12px', color: '#ff453a',
                    marginTop: 2, marginBottom: 6, paddingLeft: 16,
                    fontFamily: SF,
                  }}>
                    {errors[k]}
                  </div>
                )}
                {i < FIELDS.length - 1 && (
                  <div style={{
                    height: '0.5px',
                    background: 'rgba(255,255,255,0.06)',
                    margin: '0 16px',
                  }} />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(44,44,46,0.6)' : 'var(--accent)',
              border: 'none', borderRadius: 12,
              color: loading ? 'rgba(235,235,245,0.3)' : 'var(--bg)',
              fontSize: '15px', fontWeight: 600, fontFamily: SF,
              cursor: loading ? 'default' : 'pointer',
              transition: 'opacity 0.18s', letterSpacing: '-0.1px',
            }}
          >
            {loading ? 'Sending…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
