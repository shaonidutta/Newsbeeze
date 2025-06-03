# NewsBreeze Testing Guide

This guide covers how to test the NewsBreeze application manually and with automated tests.

## Manual Testing Checklist

### 1. Application Loading
- [ ] Application loads without errors
- [ ] Header displays correctly with logo and tagline
- [ ] Loading spinner appears while fetching news
- [ ] News cards display after loading completes

### 2. News Display
- [ ] News items display with title, source, date, and summary
- [ ] News cards have proper styling and hover effects
- [ ] External links open in new tabs
- [ ] Date formatting is correct and readable

### 3. Audio Functionality
- [ ] "Generate Audio" button appears on news cards
- [ ] Clicking generates audio (shows "Generating..." state)
- [ ] Play/Pause buttons work correctly
- [ ] Audio plays the summarized text
- [ ] Multiple audio instances don't conflict

### 4. Error Handling
- [ ] Graceful fallback when RSS feeds fail
- [ ] Error message displays when news loading fails
- [ ] Retry button works correctly
- [ ] Fallback summary when AI summarization fails

### 5. Responsive Design
- [ ] Layout works on desktop (1200px+)
- [ ] Layout works on tablet (768px-1199px)
- [ ] Layout works on mobile (320px-767px)
- [ ] Touch interactions work on mobile devices

### 6. Performance
- [ ] Initial page load is under 3 seconds
- [ ] News loading is under 10 seconds
- [ ] Audio generation is under 30 seconds
- [ ] No memory leaks during extended use

## Browser Compatibility Testing

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## API Testing

### 1. RSS Feed Integration
```bash
# Test RSS feed accessibility
curl "https://api.allorigins.win/get?url=https://feeds.bbci.co.uk/news/rss.xml"
```

### 2. Hugging Face API
```bash
# Test summarization API (replace YOUR_API_KEY)
curl -X POST \
  https://api-inference.huggingface.co/models/Falconsai/text_summarization \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "This is a test article about technology news..."}'
```

## Automated Testing Setup

### 1. Install Testing Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### 2. Configure Vitest
Add to `vite.config.ts`:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### 3. Test Examples

#### Component Test
```typescript
// src/components/__tests__/Header.test.tsx
import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />)
    expect(screen.getByText('NewsBreeze')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Header />)
    expect(screen.getByText('Your Celebrity-Powered Audio News Reader')).toBeInTheDocument()
  })
})
```

#### Service Test
```typescript
// src/services/__tests__/newsService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { fetchNews } from '../newsService'

// Mock axios
vi.mock('axios')

describe('newsService', () => {
  it('should fetch and parse news successfully', async () => {
    // Mock implementation
    const mockResponse = {
      data: {
        contents: '<rss><channel><item><title>Test News</title></item></channel></rss>'
      }
    }
    
    // Test implementation
    const news = await fetchNews()
    expect(Array.isArray(news)).toBe(true)
  })
})
```

## Load Testing

### 1. Using Artillery
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Load homepage"
    requests:
      - get: "/"
```

Run test:
```bash
artillery run load-test.yml
```

## Accessibility Testing

### 1. Manual Checks
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader compatibility
- [ ] Alt text for images/icons

### 2. Automated Tools
- Use axe-core browser extension
- Run Lighthouse accessibility audit
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Security Testing

### 1. Content Security Policy
- [ ] No inline scripts or styles
- [ ] External resources are from trusted domains
- [ ] XSS protection is enabled

### 2. API Security
- [ ] API keys are not exposed in client code
- [ ] HTTPS is enforced
- [ ] Rate limiting is implemented

## Performance Testing

### 1. Lighthouse Audit
Run in Chrome DevTools:
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

### 2. Core Web Vitals
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

## Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

## Test Data

### Mock News Data
The application includes mock data for testing when RSS feeds are unavailable:
- Technology breakthrough news
- Climate summit agreement
- Space exploration discovery

### Test Scenarios
1. **Happy Path**: All APIs work, news loads successfully
2. **API Failure**: RSS feeds fail, fallback to mock data
3. **Partial Failure**: Some feeds work, others fail
4. **Network Issues**: Slow/timeout responses
5. **Invalid Data**: Malformed RSS feeds

## Debugging Tips

### 1. Browser DevTools
- Check Console for errors
- Monitor Network tab for API calls
- Use React DevTools for component inspection

### 2. Common Issues
- CORS errors with RSS feeds
- API rate limiting
- Audio playback issues
- Mobile touch events

### 3. Logging
Enable verbose logging by setting:
```javascript
localStorage.setItem('debug', 'newsbreeze:*')
```

## Test Reports

Generate test coverage reports:
```bash
npm run test -- --coverage
```

View reports in `coverage/` directory.
