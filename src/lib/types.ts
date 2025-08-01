export interface ChatStep {
  id: number;
  sender: 'bot';
  type: 'text' | 'audio' | 'image' | 'video' | 'quick-reply' | 'cta' | 'image-generating';
  content?: string;
  audioDuration?: number; // in seconds
  waitForUser?: boolean;
  options?: { text: string; value: any }[];
  delay?: number; // in ms
}

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'audio' | 'image' | 'video' | 'quick-reply' | 'cta' | 'loading' | 'image-generating';
  content?: string;
  audioDuration?: number;
  imageSrc?: string;
  timestamp: string;
  options?: { text: string; value: any }[];
  status?: 'sent' | 'delivered' | 'read';
}
