
export type ToolType = 'text' | 'image' | 'voice' | 'dashboard';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
