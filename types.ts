export interface CypressAction {
  id: string;
  label: string;
  code: string;
  category: 'action' | 'assertion' | 'form' | 'input';
  description?: string;
}

export interface GeneratorState {
  html: string;
  description: string;
  generatedSelector: string;
  appendedActions: string[];
  isLoading: boolean;
  error: string | null;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const ACTION_CATEGORIES = [
  { id: 'action', label: 'Actions' },
  { id: 'input', label: 'Input' },
  { id: 'form', label: 'Form' },
  { id: 'assertion', label: 'Assertions' },
] as const;