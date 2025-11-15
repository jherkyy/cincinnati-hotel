'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface UserChatProps {
  onBack: () => void
}

export default function UserChat({ onBack }: UserChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to Cincinnati Hotel! I\'m your personal concierge. How can I help you today? Feel free to ask about our rooms, amenities, dining options, or anything else about your stay.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [showContactForm, setShowContactForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'guest-user', // Placeholder user ID
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        let botContent: string

        if (typeof data.response === 'string') {
          botContent = data.response
        } else if (data.response && typeof data.response === 'object') {
          botContent = data.response.output || data.response.message || JSON.stringify(data.response)
        } else {
          botContent = "I'm sorry, I couldn't process your request. Please try again."
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        // Handle error response
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I'm having trouble connecting right now. Would you like to leave your contact details so our customer service team can get back to you?",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setShowContactForm(true)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Would you like to leave your contact details so our customer service team can get back to you?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setShowContactForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center overflow-hidden flex flex-col" 
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      {/* Background Overlays - similar to landing page */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-foreground">Cincinnati Hotel</h1>
            <p className="text-sm text-muted-foreground font-light">Guest Concierge</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              // onClick={handleRefresh} // Functionality to be added later
            >
              Refresh
            </Button>
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full h-[calc(100vh-theme(spacing.32))] mt-8 mb-8 relative z-10">
        <div className="bg-background/90 border border-border rounded-lg shadow-xl flex flex-col flex-1 overflow-hidden h-full">
          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md lg:max-w-xl px-6 py-4 rounded-lg font-light ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-foreground rounded-bl-none'
                    }`}
                  >
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-md lg:max-w-xl px-6 py-4 rounded-lg font-light bg-card border border-border text-foreground rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              {showContactForm && (
                <Card className="border border-border bg-card p-6 mt-8">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-light text-foreground mb-2">Leave Your Contact Details</h3>
                      <p className="text-sm text-muted-foreground font-light">Our team will get back to you with the information you need.</p>
                    </div>
                  </div>
                  <form className="space-y-3">
                    <Input 
                      placeholder="Your Name" 
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Input 
                      placeholder="Your Email" 
                      type="email"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Input 
                      placeholder="Your Phone" 
                      type="tel"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Submit Information
                    </Button>
                  </form>
                </Card>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Floating Input Area */}
          <footer className="p-4 bg-transparent">
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-full shadow-lg flex items-center gap-3 px-4 py-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                placeholder="Ask me anything about the hotel..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 flex items-center justify-center"
              >
                <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
