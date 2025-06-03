import { useState, useEffect } from 'react'
import './App.css'
import NewsCard from './components/NewsCard'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import { NewsItem } from './types/news'
import { fetchNews } from './services/newsService'

function App() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const newsData = await fetchNews()
      setNews(newsData)
    } catch (err) {
      setError('Failed to load news. Please try again later.')
      console.error('Error loading news:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {loading && <LoadingSpinner />}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadNews} className="retry-button">
              Try Again
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="news-grid">
            {news.map((item, index) => (
              <NewsCard key={index} newsItem={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
