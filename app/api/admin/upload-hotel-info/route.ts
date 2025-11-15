import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = process.env.ADMIN_UPLOAD_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/upload-hotel-info'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    // Create FormData for n8n webhook
    const n8nFormData = new FormData()
    n8nFormData.append('file', file)
    n8nFormData.append('fileName', file.name)
    n8nFormData.append('fileSize', file.size.toString())
    n8nFormData.append('uploadedAt', new Date().toISOString())

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: n8nFormData,
    })

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, await response.text())
      return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: file.name,
      fileSize: file.size,
      n8nResponse: result
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
