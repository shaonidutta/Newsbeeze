// Application configuration
export const APP_CONFIG = {
  name: 'NewsBreeze',
  version: '1.0.0',
  description: 'Your Celebrity-Powered Audio News Reader',
  
  // API Configuration
  apis: {
    huggingFace: {
      baseUrl: 'https://api-inference.huggingface.co',
      models: {
        summarization: 'Falconsai/text_summarization'
      }
    },
    corsProxy: 'https://api.allorigins.win/get?url='
  },
  
  // RSS Feed Sources
  rssSources: [
    {
      url: 'https://feeds.bbci.co.uk/news/rss.xml',
      source: 'BBC News',
      enabled: true
    },
    {
      url: 'https://rss.cnn.com/rss/edition.rss',
      source: 'CNN',
      enabled: true
    },
    {
      url: 'https://feeds.reuters.com/reuters/topNews',
      source: 'Reuters',
      enabled: true
    }
  ],
  
  // UI Configuration
  ui: {
    maxNewsItems: 10,
    itemsPerFeed: 5,
    summaryMaxLength: 200,
    autoRefreshInterval: 300000, // 5 minutes
  },
  
  // Audio Configuration
  audio: {
    defaultRate: 0.9,
    defaultPitch: 1.1,
    defaultVolume: 1.0,
    generationTimeout: 30000 // 30 seconds
  }
}

export default APP_CONFIG
