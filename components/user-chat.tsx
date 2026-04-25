'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { generateUserId } from '@/lib/utils'
import ContactForm from '@/components/contact-form'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  showForm?: boolean
}

interface UserChatProps {
  onBack: () => void
}

const SUGGESTIONS = ['Check-in time', 'Pool hours', 'Dining options', 'Valet parking', 'Spa services']

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'


function AtmoBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 40% at 50% 110%, var(--accent-glow) 0%, transparent 60%), var(--bg)`,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
        background: 'linear-gradient(90deg,transparent,var(--accent),transparent)', opacity: 0.25,
      }} />
    </div>
  )
}

export default function UserChat({ onBack }: UserChatProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content: "Good evening. I'm your personal concierge at The Cincinnati Hotel. Whether you need information about our amenities, dining, or any aspect of your stay — I'm here to assist.",
    timestamp: new Date(),
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [showContactModal, setShowContactModal] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  useEffect(() => {
    setUserId(generateUserId())
  }, [])

  const isFallbackResponse = (response: unknown): boolean => {
    const exactFallbackMessage = "I dont have prior information about the topic you are asking. I apologize for the inconvenience. To ensure you get the correct answer, please provide your Name, Phone Number, and Email, using the form below and a representative will contact you shortly."
    if (typeof response === 'string') return response.trim() === exactFallbackMessage
    if (response && typeof response === 'object') {
      const r = response as Record<string, unknown>
      if (r.fallback === true) return true
      if (r.output && typeof r.output === 'string') return r.output.trim() === exactFallbackMessage
    }
    return false
  }

  const handleContactSubmit = async (data: { name: string; phone: string; email: string }) => {
    const response = await fetch('/api/submit-contact-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data }),
    })
    if (!response.ok) throw new Error('Failed to submit contact information')
  }

  const handleSendMessage = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        let botContent: string
        let showForm = false

        if (typeof data.response === 'string') {
          botContent = data.response
          showForm = isFallbackResponse(data.response)
        } else if (data.response && typeof data.response === 'object') {
          const r = data.response as Record<string, unknown>
          if (Array.isArray(data.response) && data.response.length > 0) {
            const item = data.response[0] as Record<string, unknown>
            botContent = (item.output as Record<string, unknown>)?.output as string ?? ''
            showForm = isFallbackResponse(item.output)
          } else {
            botContent = (r.output || r.message || JSON.stringify(data.response)) as string
            showForm = isFallbackResponse(data.response)
          }
        } else {
          botContent = "I'm sorry, I couldn't process your request. Please try again."
        }

        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botContent,
          timestamp: new Date(),
          showForm,
        }])

        if (showForm) {
          setTimeout(() => setShowContactModal(true), 900)
        }
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
          timestamp: new Date(),
        }])
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUserId(generateUserId())
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Good evening. I'm your personal concierge at The Cincinnati Hotel. Whether you need information about our amenities, dining, or any aspect of your stay — I'm here to assist.",
      timestamp: new Date(),
    }])
    setInput('')
    setIsLoading(false)
    setShowContactModal(false)
  }

  const handleBack = () => {
    setUserId(generateUserId())
    onBack()
  }

  return (
    <div style={{
      position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      <AtmoBg />

      {/* Vibrancy nav bar */}
      <div style={{
        flexShrink: 0, position: 'relative', zIndex: 2,
        background: 'rgba(18,18,20,0.72)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        padding: '16px 0 14px',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          {/* Top row: back + reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={handleBack} style={{
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
            <button onClick={handleReset} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontSize: '13px', fontFamily: SF,
              fontWeight: 400, letterSpacing: '0.01em',
            }}>
              Refresh
            </button>
          </div>

          {/* Bottom row: title + avatar */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: '26px', color: 'var(--text)',
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px',
              }}>Concierge</div>
              <div style={{
                fontSize: '11px', color: '#34c759', marginTop: 5,
                fontFamily: SF, fontWeight: 400,
                display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.04em',
              }}>
                <span className="pulse-gold" style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#34c759', display: 'inline-block',
                }} />
                Available now
              </div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '0.5px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <Image src="/hotel-logo.png" width={34} height={34} alt="Hotel" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} style={{
        flex: 1, overflow: 'auto', padding: '20px 0 12px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          {messages.map((msg) => {
            const isUser = msg.type === 'user'
            return (
              <div key={msg.id} className="msg-anim" style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: 8, alignItems: 'flex-end', gap: 8,
              }}>
                {!isUser && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--surface2)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    flexShrink: 0, marginBottom: 2, overflow: 'hidden',
                  }}>
                    <Image src="/hotel-logo.png" width={26} height={26} alt="Hotel" style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '72%', padding: '9px 14px',
                  background: 'transparent',
                  borderRadius: isUser ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
                  color: isUser ? 'var(--accent)' : 'var(--text)',
                  fontSize: '14px', lineHeight: 1.6,
                  fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
                  fontWeight: 400,
                  border: isUser
                    ? '1px solid var(--accent)'
                    : '0.5px solid rgba(255,255,255,0.12)',
                }}>
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--surface2)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                flexShrink: 0, overflow: 'hidden',
              }}>
                <Image src="/hotel-logo.png" width={26} height={26} alt="Hotel" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{
                padding: '10px 14px', background: 'transparent',
                borderRadius: '3px 14px 14px 14px',
                display: 'flex', gap: 5, alignItems: 'center',
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}>
                <div className="dot1" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-dim)' }} />
                <div className="dot2" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-dim)' }} />
                <div className="dot3" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-dim)' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion chips */}
      {messages.length <= 2 && !isLoading && (
        <div style={{ padding: '0 0 10px', zIndex: 2, position: 'relative' }}>
          <div style={{
            maxWidth: 640, margin: '0 auto', padding: '0 24px',
            display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => handleSendMessage(s)} style={{
                padding: '5px 13px', fontSize: '12px',
                fontFamily: SF, fontWeight: 400,
                background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.15)',
                borderRadius: '20px', color: 'var(--accent)',
                cursor: 'pointer', letterSpacing: '0.02em',
                transition: 'opacity 0.15s',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Apple vibrancy input bar */}
      <div style={{
        background: 'rgba(18,18,20,0.7)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        flexShrink: 0, zIndex: 2, position: 'relative',
        padding: '10px 0 16px',
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto', padding: '0 24px',
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: 'transparent',
            borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.15)',
            padding: '0 14px',
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your concierge anything…"
              style={{
                flex: 1, padding: '10px 0', background: 'transparent',
                border: 'none', color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
                outline: 'none', letterSpacing: '0.01em',
              }}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: input.trim() ? 'var(--accent)' : 'rgba(44,44,46,0.85)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.2s, transform 0.12s',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 11V2M2 6.5L6.5 2L11 6.5"
                stroke={input.trim() ? 'var(--bg)' : 'var(--text-dim)'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact modal */}
      {showContactModal && (
        <ContactForm
          onSubmit={async (data) => {
            await handleContactSubmit(data)
            setShowContactModal(false)
            setMessages((prev) => [...prev, {
              id: Date.now().toString(),
              type: 'bot',
              content: 'Your request has been received. A team member will be in touch shortly.',
              timestamp: new Date(),
            }])
          }}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  )
}
