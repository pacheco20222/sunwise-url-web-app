export interface User {
  id: number;
  email: string;
  username: string;
  date_joined: string;
  url_count?: number;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

export interface ShortURL {
  id: number;
  short_code: string;
  short_url: string;
  target_url: string;
  is_private: boolean;
  owner_email?: string;
  views: number;
  created_at: string;
  updated_at: string;
  last_visit?: string | null;
}

export interface BulkUploadResult {
  total: number;
  success: number;
  failed: number;
  results: {
    original_url: string;
    short_url?: string;
    short_code?: string;
    error?: string;
    status: 'success' | 'failed';
  }[];
}
