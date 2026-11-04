// Single source of truth for author / reviewer presentation.
// Never add a name, title, credential or institution here that is not real and verifiable.

export const AUTHOR = {
  name: 'Eren Şimşir',
  title: 'Founder and Editor',
  slug: 'eren-simsir',
} as const;

export interface Reviewer {
  name: string;
  title: string;
  url?: string;       // e.g. LinkedIn
  reviewedOn: string; // YYYY-MM-DD
  scope: string;      // what was reviewed
}

// null = no independent reviewer. Nothing is rendered while this is null.
// Fill in only when a real, named person has actually reviewed the content.
export const REVIEWER: Reviewer | null = null;
