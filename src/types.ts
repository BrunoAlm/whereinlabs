export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content_markdown: string;
  cover_image_url: string;
  category: string;
  type: string;
  tags: string[];
  status: string;
  version: string;
  impact: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  game?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PostsResponse {
  posts: Post[];
}
