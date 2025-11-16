'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface ContactFormProps {
  onSubmit: (data: { name: string; phone: string; email: string }) => Promise<void>
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Phone validation regex for US format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
  const phoneRegex = /^(\+1\s?)?(\(\d{3}\)\s?|\d{3}-?)\d{3}-?\d{4}$/

  const isEmailValid = emailRegex.test(formData.email)
  const isPhoneValid = phoneRegex.test('+1' + formData.phone)
  const isNameValid = formData.name.trim().length > 0
  const isFormValid = isNameValid && isEmailValid && isPhoneValid

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: formData.name.trim(),
        phone: '+1' + formData.phone,
        email: formData.email.trim(),
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Error handling could be added here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md lg:max-w-xl px-6 py-4 rounded-lg font-light bg-card border border-border text-foreground rounded-bl-none">
        <div className="text-center text-green-600">
          Information has been sent successfully! A representative will contact you shortly.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md lg:max-w-xl px-6 py-4 rounded-lg font-light bg-card border border-border text-foreground rounded-bl-none">
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full ${!isNameValid && formData.name ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Phone Number
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md">
                <span className="text-sm text-muted-foreground">+1</span>
              </div>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={`flex-1 rounded-l-none ${!isPhoneValid && formData.phone ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {formData.phone && !isPhoneValid && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid US phone number</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`w-full ${!isEmailValid && formData.email ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {formData.email && !isEmailValid && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Information'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
