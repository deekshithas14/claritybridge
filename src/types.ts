export type InputMode = 'text' | 'image';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type PointSeverity = 'info' | 'warning' | 'critical';

export type ActionPriority = 'urgent' | 'recommended' | 'optional';

export interface KeyInformationItem {
  id: string;
  label: string;
  value: string;
  note?: string;
  category?: string;
  iconType?: 'money' | 'calendar' | 'hash' | 'building' | 'person' | 'phone' | 'alert' | 'file' | 'shield';
}

export interface ImportantPoint {
  id: string;
  title: string;
  detail: string;
  severity: PointSeverity;
}

export interface ActionStep {
  id: string;
  stepNumber: number;
  action: string;
  details: string;
  timeframe: string;
  priority: ActionPriority;
  completed?: boolean;
}

export interface SimpleExplanation {
  summaryParagraphs: string[];
  theBottomLine: string;
  whoIsAffected: string;
  toneSummary: string;
}

export interface ClarityAnalysis {
  id: string;
  headline: string;
  documentType: string;
  urgencyLevel: UrgencyLevel;
  urgencyReason: string;
  simpleExplanation: SimpleExplanation;
  keyInformation: KeyInformationItem[];
  importantPoints: ImportantPoint[];
  whatToDoNext: ActionStep[];
  analyzedAt: string;
  inputMode: InputMode;
  previewSnippet?: string;
  imageUrl?: string;
}

export interface PresetExample {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  text: string;
}
