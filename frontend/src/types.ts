export interface ImportantDate {
  date: string;
  description: string;
}

export interface MatterSummary {
  title: string;
  executiveSummary: string;
  partiesInvolved: string[];
  importantDates: ImportantDate[];
  keyFacts: string[];
  issuesOrClaims: string[];
  requestedActions: string[];
  risksAndMissingInfo: string[];
  finalSummary: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  summary: MatterSummary;
}

export interface ChatResponse {
  response: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  summary?: MatterSummary;
  timestamp: Date;
}
