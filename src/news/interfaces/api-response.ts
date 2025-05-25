export interface NewsApiResponse {
  articles: Article[];
}

export interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface Source {
  id: string | null;
  name: string;
}

export interface NewsSuccessResponse {
  status: 'success';
  articles: Article[];
}

interface NewsErrorResponse {
  status: 'error';
  msg: string;
}

export type NewsResponse = NewsSuccessResponse | NewsErrorResponse;
