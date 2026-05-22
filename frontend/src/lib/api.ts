const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  name: string | null;
  subscription_tier: string;
  subscription_status: string | null;
  subscription_end: string | null;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `Error ${res.status}`);
    }

    return res.json();
  }

  async signup(email: string, name: string, password: string) {
    const data = await this.request<{ access_token: string; user: User }>(
      "/api/auth/signup",
      { method: "POST", body: JSON.stringify({ email, name, password }) }
    );
    this.setToken(data.access_token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string; user: User }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<User>("/api/auth/me");
  }

  async createCheckoutSession(plan: "pro" | "max" = "max") {
    return this.request<{ url: string }>("/api/billing/checkout-session", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  }

  async createPortalSession() {
    return this.request<{ url: string }>("/api/billing/portal-session", { method: "POST" });
  }

  async repurpose(content: string, sourceType: string, tone: string, formats: string[]) {
    return this.request<{
      success: boolean;
      generation_id: string;
      results: Record<string, string>;
      time_ms: number;
    }>("/api/repurpose", {
      method: "POST",
      body: JSON.stringify({ content, source_type: sourceType, tone, formats }),
    });
  }

  async getLibrary(limit = 20, offset = 0) {
    return this.request<{ total: number; items: GenerationItem[] }>(
      `/api/library?limit=${limit}&offset=${offset}`
    );
  }

  async getGeneration(id: string) {
    return this.request<GenerationItem>(`/api/library/${id}`);
  }

  async deleteGeneration(id: string) {
    return this.request<{ success: boolean }>(`/api/library/${id}`, { method: "DELETE" });
  }

  async getUsage() {
    return this.request<{
      daily_count: number;
      daily_limit: number;
      total_count: number;
      tier: string;
    }>("/api/auth/usage");
  }
}

export interface GenerationItem {
  id: string;
  original_content: string;
  content_source: string;
  tone: string;
  tiktok_script: string | null;
  linkedin_post: string | null;
  twitter_thread: string | null;
  instagram_caption: string | null;
  newsletter_draft: string | null;
  youtube_description: string | null;
  email_subject: string | null;
  reddit_post: string | null;
  generation_time_ms: number | null;
  created_at: string;
}

export const api = new ApiClient();
