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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I don't have that information right now. Would you like to leave your contact details so our customer service team can get back to you with the answer?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setShowContactForm(true)
    }, 800)
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
              placeholder="Ask me anything about the hotel..."
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
