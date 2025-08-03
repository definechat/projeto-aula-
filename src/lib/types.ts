
export interface ChatStep {
  id: number;
  sender: 'bot';
  type: 'text' | 'audio' | 'image' | 'video' | 'quick-reply' | 'cta' | 'calculator' | 'report' | 'before-after';
  content?: string;
  imageSrc?: string;
  beforeImageSrc?: string;
  afterImageSrc?: string;
  audioSrc?: string;
  audioDuration?: number; // in seconds
  waitForUser?: boolean;
  options?: { text: string; value: any }[];
  delay?: number; // in ms
  autoplay?: boolean;
}

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'audio' | 'image' | 'video' | 'quick-reply' | 'cta' | 'loading' | 'before-after';
  content?: string;
  audioSrc?: string;
  audioDuration?: number;
  imageSrc?: string;
  beforeImageSrc?: string;
  afterImageSrc?: string;
  timestamp: string;
  options?: { text: string; value: any }[];
  status?: 'sent' | 'delivered' | 'read';
  autoplay?: boolean;
  playbackDelay?: number;
  hasInteracted?: boolean;
}

export interface UserInfo {
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'active';
}
