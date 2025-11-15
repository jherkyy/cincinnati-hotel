'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Upload, BarChart3 } from 'lucide-react'
import { useRef } from 'react'

interface AdminDashboardProps {
  onBack: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [stats] = useState({
    totalSessions: 342,
    questionsPerTopic: [
      { topic: 'Rooms & Suites', count: 89 },
      { topic: 'Restaurant & Dining', count: 67 },
      { topic: 'Amenities', count: 54 },
      { topic: 'Parking & Transport', count: 42 },
      { topic: 'Events & Conferences', count: 38 },
      { topic: 'Billing & Checkout', count: 52 },
    ],
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/admin/upload-hotel-info', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus('File uploaded successfully!')
        setSelectedFile(null)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setUploadStatus(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground font-light">Cincinnati Hotel</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <Card className="border border-border bg-card mb-12 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-light text-foreground">Upload Hotel Information</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8">
              Upload a PDF containing your hotel's information. This will serve as the knowledge base for our AI concierge. Uploading a new file will replace the previous one.
            </p>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer bg-card/50 hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-foreground font-light mb-2">Drag your PDF here or click to browse</p>
              {selectedFile && <p className="text-sm text-primary mb-2">{selectedFile.name}</p>}
              <p className="text-sm text-muted-foreground">Supported format: PDF (Max 50MB)</p>
            </label>

            {selectedFile && (
              <div className="mt-6 flex items-center gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload File
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            )}

            {uploadStatus && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                uploadStatus.includes('successfully')
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </Card>

        {/* Statistics Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-light text-foreground">Chat Statistics</h2>
          </div>

          {/* Total Sessions */}
          <Card className="border border-border bg-card mb-8 p-8">
            <p className="text-muted-foreground font-light mb-2">Total Chat Sessions</p>
            <p className="text-5xl font-light text-primary">{stats.totalSessions}</p>
          </Card>

          {/* Questions by Topic */}
          <div>
            <h3 className="text-xl font-light text-foreground mb-6">Questions Per Topic</h3>
            <div className="grid gap-4">
              {stats.questionsPerTopic.map((item, idx) => (
                <Card key={idx} className="border border-border bg-card p-6 hover:border-primary/50 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-light text-foreground">{item.topic}</p>
                    <p className="text-2xl font-light text-primary">{item.count}</p>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / 89) * 100}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
