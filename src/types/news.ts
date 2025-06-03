export interface NewsItem {
  title: string
  description: string
  summary: string
  link: string
  pubDate: string
  source: string
  audioUrl?: string
  isGeneratingAudio?: boolean
}

export interface RSSFeedItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
}
