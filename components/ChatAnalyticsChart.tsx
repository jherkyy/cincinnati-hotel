'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TopicData {
  topic: string
  count: number
}

interface ChatAnalyticsState {
  totalSessions: number
  questionsPerTopic: TopicData[]
}

export default function ChatAnalyticsChart() {
  const [data, setData] = useState<ChatAnalyticsState>({
    totalSessions: 0,
    questionsPerTopic: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChatData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: conversations, error: fetchError } = await supabase
        .from('hotel_conversation')
        .select('*')

      if (fetchError) throw fetchError

      const uniqueUserIds = new Set(conversations?.map(conv => conv['user-id']) || [])
      const totalSessions = uniqueUserIds.size

      const topicCounts: { [key: string]: number } = {}
      conversations?.forEach(conv => {
        if (conv.topic && conv.topic.trim() !== '') {
          topicCounts[conv.topic] = (topicCounts[conv.topic] || 0) + 1
        }
      })

      const questionsPerTopic = Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)

      setData({ totalSessions, questionsPerTopic })
    } catch (err) {
      console.error('Error fetching chat data:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChatData()

    const subscription = supabase
      .channel('hotel_conversation_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hotel_conversation' }, () => {
        fetchChatData()
      })
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [])

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="w-6 h-px bg-primary/40 animate-pulse rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="label-caps flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-red-400/70">{error}</span>
        </p>
      </div>
    )
  }

  const maxCount = Math.max(...data.questionsPerTopic.map(d => d.count), 1)

  return (
    <div className="space-y-6">

      {/* KPI — total sessions */}
      <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-black/30 border border-primary/15 p-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -mx-6 mb-5 mt-0" />
        <p className="label-caps text-primary/60 mb-3">Total Chat Sessions</p>
        <p className="text-7xl font-light text-primary leading-none" style={{ fontFamily: 'var(--font-bodoni), serif' }}>
          {data.totalSessions}
        </p>
      </div>

      {/* Bar chart */}
      {data.questionsPerTopic.length > 0 && (
        <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-black/30 border border-white/8 p-6">
          <div className="mb-6">
            <p className="label-caps text-primary/60 mb-2">Breakdown</p>
            <h3 className="text-base font-light text-foreground">Questions Per Topic</h3>
          </div>

          {/* Custom minimal bar chart — avoids Recharts layout quirks */}
          <div className="space-y-3">
            {data.questionsPerTopic.map((item, i) => {
              const pct = (item.count / maxCount) * 100
              const opacity = 1 - (i / data.questionsPerTopic.length) * 0.45
              return (
                <div key={item.topic} className="group flex items-center gap-4">
                  <div className="w-36 flex-shrink-0 text-right">
                    <span className="label-caps text-foreground/40 group-hover:text-foreground/65 transition-colors duration-200 leading-tight block">
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-5 rounded-sm bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-sm transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: `oklch(0.82 0.07 72 / ${opacity})`,
                        }}
                      />
                    </div>
                    <span className="label-caps text-foreground/35 w-6 text-right flex-shrink-0">
                      {item.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
