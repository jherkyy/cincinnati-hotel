'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send, AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-foreground">Cincinnati Hotel</h1>
            <p className="text-sm text-muted-foreground font-light">Guest Concierge</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {message.content}
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
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/80 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              placeholder="Ask me anything about the hotel..."
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
