export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  image?: string;
}

export interface NewsApiResponse {
  items: NewsArticle[];
  category?: string;
  source?: string;
  fetchedAt?: string;
}
