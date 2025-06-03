# NewsBreeze - Your Celebrity-Powered Audio News Reader

NewsBreeze is a modern web application that aggregates the latest news headlines, summarizes them using AI, and reads them aloud in celebrity voices. Built with React, TypeScript, and integrated with Hugging Face AI models.

## Features

- 📰 **News Aggregation**: Fetches latest headlines from multiple RSS feeds (BBC, CNN, Reuters)
- 🤖 **AI Summarization**: Uses Hugging Face's Falconsai/text_summarization model to create concise summaries
- 🎙️ **Voice Generation**: Text-to-speech functionality with plans for celebrity voice cloning using coqui/xtts-v2
- 🎨 **Modern UI**: Clean, responsive design with glassmorphism effects
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices

## Technologies Used

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with modern features (backdrop-filter, grid, flexbox)
- **Lucide React** for beautiful icons

### AI/ML Models
- **Falconsai/text_summarization** (Hugging Face) - Text summarization
- **coqui/xtts-v2** (Planned) - Voice cloning and generation
- **Web Speech API** (Current fallback) - Text-to-speech

### APIs & Services
- **RSS Feeds** - BBC News, CNN, Reuters
- **Hugging Face Inference API** - Text summarization
- **AllOrigins CORS Proxy** - For RSS feed access

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- A Hugging Face account (free) for API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd newsbreeze
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Hugging Face API key:
   ```
   REACT_APP_HUGGINGFACE_API_KEY=your_api_key_here
   ```
   
   Get your free API key from: https://huggingface.co/settings/tokens

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with branding
│   ├── NewsCard.tsx    # Individual news item display
│   └── LoadingSpinner.tsx
├── services/           # API and external service integrations
│   ├── newsService.ts  # RSS feed fetching and parsing
│   ├── summaryService.ts # Hugging Face summarization
│   └── audioService.ts # Text-to-speech functionality
├── types/              # TypeScript type definitions
│   └── news.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## How It Works

1. **News Fetching**: The app fetches RSS feeds from major news sources using a CORS proxy
2. **XML Parsing**: RSS XML is parsed using the browser's DOMParser
3. **Text Summarization**: Each article description is sent to Hugging Face's summarization model
4. **Audio Generation**: Summaries can be converted to speech using the Web Speech API
5. **UI Rendering**: News items are displayed in a responsive grid with audio controls

## Models Used

### Text Summarization
- **Model**: `Falconsai/text_summarization`
- **Provider**: Hugging Face
- **Purpose**: Creates concise summaries of news articles
- **Parameters**: 
  - max_length: 100 tokens
  - min_length: 30 tokens
  - do_sample: false

### Voice Generation (Planned)
- **Model**: `coqui/xtts-v2`
- **Purpose**: Celebrity voice cloning and text-to-speech
- **Features**: Multiple celebrity voice options

## API Usage

### Hugging Face API
The app uses the Hugging Face Inference API for text summarization:

```typescript
const response = await axios.post(
  'https://api-inference.huggingface.co/models/Falconsai/text_summarization',
  { inputs: text },
  { headers: { 'Authorization': `Bearer ${API_KEY}` } }
)
```

### RSS Feeds
News is fetched from:
- BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
- CNN: `https://rss.cnn.com/rss/edition.rss`
- Reuters: `https://feeds.reuters.com/reuters/topNews`

## Future Enhancements

- [ ] Integration with actual coqui/xtts-v2 voice cloning
- [ ] Backend API for better RSS feed handling
- [ ] User preferences for news sources and voice selection
- [ ] Offline support with service workers
- [ ] News categorization and filtering
- [ ] Social sharing features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for providing free AI model access
- The open-source community for the amazing tools and libraries
- News organizations for providing RSS feeds
