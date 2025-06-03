import axios from "axios";
import { NewsItem, RSSFeedItem } from "../types/news";
import { summarizeText } from "./summaryService";
import APP_CONFIG from "../config/app";

// RSS feeds to fetch news from
const RSS_FEEDS = APP_CONFIG.rssSources.filter((source) => source.enabled);

// CORS proxy for RSS feeds (in production, you'd want your own backend)
const CORS_PROXY = APP_CONFIG.apis.corsProxy;

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const allNews: NewsItem[] = [];

    // Fetch from multiple RSS feeds
    for (const feed of RSS_FEEDS) {
      try {
        const response = await axios.get(
          `${CORS_PROXY}${encodeURIComponent(feed.url)}`
        );
        const xmlText = response.data.contents;

        // Parse RSS XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        // Convert to our format and get configured number of items
        const feedNews = Array.from(items)
          .slice(0, APP_CONFIG.ui.itemsPerFeed)
          .map((item): RSSFeedItem => {
            const title =
              item.querySelector("title")?.textContent || "No title";
            const description =
              item.querySelector("description")?.textContent ||
              "No description";
            const link = item.querySelector("link")?.textContent || "#";
            const pubDate =
              item.querySelector("pubDate")?.textContent ||
              new Date().toISOString();

            return {
              title: cleanText(title),
              description: cleanText(description),
              link,
              pubDate,
              source: feed.source,
            };
          });

        // Generate summaries for each news item
        for (const item of feedNews) {
          try {
            const summary = await summarizeText(item.description);
            allNews.push({
              ...item,
              summary: summary || item.description.substring(0, 200) + "...",
            });
          } catch (error) {
            console.error("Error summarizing text:", error);
            // Fallback to truncated description
            allNews.push({
              ...item,
              summary: item.description.substring(0, 200) + "...",
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${feed.source}:`, error);
      }
    }

    // Sort by date (newest first) and return configured max items
    return allNews
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      .slice(0, APP_CONFIG.ui.maxNewsItems);
  } catch (error) {
    console.error("Error fetching news:", error);

    // Return mock data as fallback
    return getMockNews();
  }
};

const cleanText = (text: string): string => {
  // Remove HTML tags and clean up text
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
};

// Mock data for development/fallback
const getMockNews = (): NewsItem[] => {
  return [
    {
      title: "Breaking: Major Technology Breakthrough Announced",
      description:
        "Scientists have made a significant breakthrough in quantum computing technology that could revolutionize the industry.",
      summary:
        "Scientists announce a major quantum computing breakthrough that promises to transform technology and solve complex problems faster than ever before.",
      link: "https://example.com/tech-breakthrough",
      pubDate: new Date().toISOString(),
      source: "Tech News",
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      description:
        "World leaders have reached a unprecedented agreement on climate action during the latest global summit.",
      summary:
        "World leaders unite in historic climate agreement, setting ambitious targets for carbon reduction and renewable energy adoption worldwide.",
      link: "https://example.com/climate-summit",
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      source: "Environmental News",
    },
    {
      title: "Space Mission Discovers New Exoplanet",
      description:
        "NASA's latest space mission has discovered a potentially habitable exoplanet in a nearby star system.",
      summary:
        "NASA discovers potentially habitable exoplanet with Earth-like conditions, opening new possibilities for future space exploration and research.",
      link: "https://example.com/space-discovery",
      pubDate: new Date(Date.now() - 7200000).toISOString(),
      source: "Space News",
    },
  ];
};
