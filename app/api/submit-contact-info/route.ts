import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, name, phone, email } = await request.json()

    // Validate required fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, and email' },
        { status: 400 }
      )
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const FALLBACK_N8N_WEBHOOK_URL = process.env.FALLBACK_N8N_WEBHOOK_URL

    if (!FALLBACK_N8N_WEBHOOK_URL) {
      console.error('FALLBACK_N8N_WEBHOOK_URL environment variable not set')
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      )
    }

    // Forward the contact information to n8n webhook
    const response = await fetch(FALLBACK_N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId || 'anonymous',
        name: name.trim(),
        phone,
        email: email.trim(),
        timestamp: new Date().toISOString(),
        source: 'guest_chat_fallback',
      }),
    })

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to submit contact information to webhook' },
        { status: 500 }
      )
    }

    const webhookResponse = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Contact information submitted successfully',
      response: webhookResponse
    })

  } catch (error) {
    console.error('Submit contact info API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
