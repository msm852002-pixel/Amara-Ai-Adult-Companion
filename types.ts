
export enum Sender {
  User = 'user',
  Bot = 'model'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface UserSettings {
  flirtLevel: number; // 1-10
  isExplicit: boolean;
  customTopics: string[];
}
