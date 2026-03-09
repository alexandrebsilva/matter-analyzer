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

export const MATTER_SUMMARY_JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    title: { type: 'string' as const },
    executiveSummary: { type: 'string' as const },
    partiesInvolved: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    importantDates: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          date: { type: 'string' as const },
          description: { type: 'string' as const },
        },
        required: ['date', 'description'] as const,
        additionalProperties: false,
      },
    },
    keyFacts: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    issuesOrClaims: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    requestedActions: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    risksAndMissingInfo: {
      type: 'array' as const,
      items: { type: 'string' as const },
    },
    finalSummary: { type: 'string' as const },
  },
  required: [
    'title',
    'executiveSummary',
    'partiesInvolved',
    'importantDates',
    'keyFacts',
    'issuesOrClaims',
    'requestedActions',
    'risksAndMissingInfo',
    'finalSummary',
  ] as const,
  additionalProperties: false,
};
