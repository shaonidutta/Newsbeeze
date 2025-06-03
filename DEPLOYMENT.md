# NewsBreeze Deployment Guide

This guide covers how to deploy NewsBreeze to various platforms.

## Prerequisites

- Node.js 16+ and npm
- A Hugging Face account with API key
- Git repository (for deployment platforms)

## Environment Variables

Before deploying, make sure to set up the following environment variables:

```bash
REACT_APP_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

## Deployment Options

### 1. Netlify (Recommended)

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Alternative - Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### 2. Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard

### 3. GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/newsbreeze"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json**:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## Production Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use platform-specific environment variable settings
- Validate environment variables at runtime

### 2. CORS Issues
- The current implementation uses a CORS proxy for RSS feeds
- For production, consider implementing your own backend API
- Alternative: Use serverless functions (Netlify Functions, Vercel API Routes)

### 3. API Rate Limits
- Hugging Face free tier has rate limits
- Consider implementing caching for summaries
- Add retry logic with exponential backoff

### 4. Performance Optimization
- Enable gzip compression on your hosting platform
- Consider implementing service workers for offline support
- Optimize images and assets

### 5. Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API usage and performance
- Implement analytics (Google Analytics, Plausible)

## Backend API (Optional)

For a more robust production setup, consider creating a backend API:

### Express.js Backend Example

```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// RSS feed proxy endpoint
app.get('/api/rss/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const feedUrls = {
      bbc: 'https://feeds.bbci.co.uk/news/rss.xml',
      cnn: 'https://rss.cnn.com/rss/edition.rss',
      reuters: 'https://feeds.reuters.com/reuters/topNews'
    };
    
    const response = await axios.get(feedUrls[source]);
    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
});

app.listen(3001, () => {
  console.log('Backend API running on port 3001');
});
```

## Security Considerations

1. **API Keys**: Store securely and rotate regularly
2. **HTTPS**: Always use HTTPS in production
3. **Content Security Policy**: Implement CSP headers
4. **Rate Limiting**: Implement rate limiting for API calls

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **CORS Errors**:
   - Verify CORS proxy is working
   - Consider implementing backend API

3. **API Errors**:
   - Check Hugging Face API key is valid
   - Verify API quotas and limits

4. **Audio Not Working**:
   - Check browser compatibility
   - Verify HTTPS is enabled (required for some audio APIs)

## Performance Monitoring

Monitor these metrics in production:
- Page load time
- API response times
- Error rates
- User engagement metrics

## Support

For deployment issues:
1. Check the GitHub Issues page
2. Review the troubleshooting section
3. Contact support with detailed error logs
