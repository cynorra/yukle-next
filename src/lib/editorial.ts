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

// Public contact address, read from one place. Verify the mailbox works before relying on it;
// to switch every mailto/contact line off, change it here.
export const CONTACT_EMAIL = 'info@loadlyapp.com';

// Verified education only. Do not add titles, employers or experience that are not confirmed.
export const AUTHOR_EDUCATION =
  'B.Sc. in Computer Engineering, Düzce University (2025); M.Sc. student in Computer Engineering, Kocaeli University.';
