'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { supabase } from '@/lib/supabase'

interface TopicData {
  topic: string;
  count: number;
  fill?: string;
}

interface ChatAnalyticsState {
  totalSessions: number;
  questionsPerTopic: TopicData[];
  chartConfig: ChartConfig;
}

const ORANGE_SHADES = [
  '#FFDAB9', // Lightest Peach
  '#FFA07A', // Light Salmon
  '#FF8C00', // Dark Orange
  '#E67300', // Slightly darker
  '#CC6600', // Darker
  '#B35900', // Even darker
  '#994D00', // Darkest
];

export default function ChatAnalyticsChart() {
  const [data, setData] = useState<ChatAnalyticsState>({
    totalSessions: 0,
    questionsPerTopic: [],
    chartConfig: {
      count: {
        label: 'Questions',
        color: ORANGE_SHADES[2], // Default color for count, a mid-range orange
      },
    },
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

      if (fetchError) {
        throw fetchError
      }

      // Calculate total sessions (unique user-ids)
      const uniqueUserIds = new Set(conversations?.map(conv => conv['user-id']) || [])
      const totalSessions = uniqueUserIds.size

      // Calculate questions per topic, filtering out null/empty topics
      const topicCounts: { [key: string]: number } = {}
      conversations?.forEach(conv => {
        if (conv.topic && conv.topic.trim() !== '') {
          topicCounts[conv.topic] = (topicCounts[conv.topic] || 0) + 1
        }
      })

      const sortedQuestionsPerTopic = Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count); // Sort by count descending

      const questionsPerTopicWithColors = sortedQuestionsPerTopic.map((item) => ({
        ...item,
        fill: 'var(--primary)', // Set a single color for all bars
      }));

      // Dynamically create chartConfig for shadcn/ui chart
      const dynamicChartConfig: ChartConfig = {
        count: {
          label: 'Questions',
          color: 'var(--primary)', // Set a single color for default
        },
      };

      questionsPerTopicWithColors.forEach((item) => {
        dynamicChartConfig[item.topic.toLowerCase().replace(/\s/g, '-')] = {
          label: item.topic,
          color: 'var(--primary)', // Use assigned fill color
        };
      });

      setData({
        totalSessions,
        questionsPerTopic: questionsPerTopicWithColors,
        chartConfig: dynamicChartConfig,
      })
    } catch (err) {
      console.error('Error fetching chat data:', err)
      setError('Failed to load chat analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChatData()

    const subscription = supabase
      .channel('hotel_conversation_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hotel_conversation'
      }, () => {
        fetchChatData()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <Card className="border border-border/50 bg-black/40 backdrop-blur-md p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading chat analytics...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-border/50 bg-black/40 backdrop-blur-md p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">{error}</div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Total Sessions Card */}
      <Card className="border border-border/50 bg-black/40 backdrop-blur-md p-8">
        <p className="text-muted-foreground font-light mb-2">Total Chat Sessions</p>
        <p className="text-5xl font-light text-primary">{data.totalSessions}</p>
      </Card>

      {/* Bar Chart - Questions per Topic (shadcn/ui style) */}
      <Card className="border border-border/50 bg-black/40 backdrop-blur-md p-6">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-xl font-light text-foreground">Questions Per Topic</CardTitle>
          <CardDescription>Number of chat sessions grouped by topic</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer config={data.chartConfig} className="min-h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={data.questionsPerTopic}
              layout="vertical"
              margin={{
                left: 100, // Increased left margin for labels
                right: 20,
                top: 5,
                bottom: 5,
              }}
            >
              <YAxis
                dataKey="topic"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const key = value.toLowerCase().replace(/\s/g, '-');
                  return data.chartConfig[key as keyof typeof data.chartConfig]?.label || value;
                }}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                layout="vertical"
                radius={5}
                fill="var(--color-count)" // This will dynamically use the color from chartConfig.count.color
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}