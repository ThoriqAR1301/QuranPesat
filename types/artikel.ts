export interface ArtikelFeed {
  status: string;
  feed: {
    title: string;
    link: string;
  };
  items: Artikel[];
}

export interface Artikel {
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string;
  description: string;
  content?: string;
  enclosure?: {
    link: string;
    type: string;
    length: number;
  };
  categories: string[];
}