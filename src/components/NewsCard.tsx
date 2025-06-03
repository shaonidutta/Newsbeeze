import React, { useState } from 'react'
import { Play, Pause, Volume2, ExternalLink, Clock } from 'lucide-react'
import { NewsItem } from '../types/news'
import { generateAudio } from '../services/audioService'
import './NewsCard.css'

interface NewsCardProps {
  newsItem: NewsItem
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(newsItem.audioUrl || null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayAudio = async () => {
    if (!audioUrl && !isGenerating) {
      // Generate audio if not available
      try {
        setIsGenerating(true)
        const generatedAudioUrl = await generateAudio(newsItem.summary)
        setAudioUrl(generatedAudioUrl)
        setIsGenerating(false)
        
        // Auto-play after generation
        playAudio(generatedAudioUrl)
      } catch (error) {
        console.error('Error generating audio:', error)
        setIsGenerating(false)
        alert('Failed to generate audio. Please try again.')
        return
      }
    } else if (audioUrl) {
      if (isPlaying) {
        pauseAudio()
      } else {
        playAudio(audioUrl)
      }
    }
  }

  const playAudio = (url: string) => {
    if (audio) {
      audio.pause()
    }
    
    const newAudio = new Audio(url)
    newAudio.addEventListener('ended', () => {
      setIsPlaying(false)
    })
    newAudio.addEventListener('error', () => {
      console.error('Error playing audio')
      setIsPlaying(false)
      alert('Error playing audio')
    })
    
    newAudio.play()
    setAudio(newAudio)
    setIsPlaying(true)
  }

  const pauseAudio = () => {
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="news-card">
      <div className="news-card-header">
        <h3 className="news-title">{newsItem.title}</h3>
        <div className="news-meta">
          <span className="news-source">{newsItem.source}</span>
          <span className="news-date">
            <Clock size={14} />
            {formatDate(newsItem.pubDate)}
          </span>
        </div>
      </div>
      
      <div className="news-content">
        <p className="news-summary">{newsItem.summary}</p>
      </div>
      
      <div className="news-actions">
        <button 
          className={`audio-button ${isGenerating ? 'generating' : ''}`}
          onClick={handlePlayAudio}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Volume2 size={20} className="generating-icon" />
              Generating...
            </>
          ) : isPlaying ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              {audioUrl ? 'Play' : 'Generate Audio'}
            </>
          )}
        </button>
        
        <a 
          href={newsItem.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="read-more-button"
        >
          <ExternalLink size={16} />
          Read Full Article
        </a>
      </div>
    </div>
  )
}

export default NewsCard
