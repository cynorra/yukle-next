'use client';

export const OPEN_COOKIE_SETTINGS_EVENT = 'loadly-open-cookie-settings';

export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="hover:text-accent transition-colors"
    >
      {label}
    </button>
  );
}
