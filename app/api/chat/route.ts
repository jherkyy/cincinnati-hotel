import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, message, timestamp } = await request.json()

    // Validate required fields
    if (!message || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: message and timestamp' },
        { status: 400 }
      )
    }

    const GUEST_CHAT_N8N_WEBHOOK_URL = process.env.GUEST_CHAT_N8N_WEBHOOK_URL

    console.log('GUEST_CHAT_N8N_WEBHOOK_URL:', GUEST_CHAT_N8N_WEBHOOK_URL)

    if (!GUEST_CHAT_N8N_WEBHOOK_URL) {
      console.error('GUEST_CHAT_N8N_WEBHOOK_URL environment variable not set')
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      )
    }

    // Forward the message to n8n webhook
    const response = await fetch(GUEST_CHAT_N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId || 'anonymous',
        message,
        timestamp,
      }),
    })

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to send message to webhook' },
        { status: 500 }
      )
    }

    const webhookResponse = await response.json()

    return NextResponse.json({
      success: true,
      response: webhookResponse
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
