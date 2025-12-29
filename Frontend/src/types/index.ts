export type Sentiment = 'HAPPY' | 'SAD' | 'ANGRY' | 'ANXIOUS';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  sentiment: Sentiment;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
}
