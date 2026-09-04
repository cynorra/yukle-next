import { NextRequest, NextResponse } from 'next/server';

const OWNER = 'cynorra';
const REPO = 'yukle-next';
const WORKFLOW_FILE = 'scraper-cron.yml';

function checkSecret(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
    || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return !!process.env.CRON_TRIGGER_SECRET && secret === process.env.CRON_TRIGGER_SECRET;
}

// Called by an external pinger (e.g. cron-job.org) every 5 minutes, since
// GitHub's own `schedule` trigger stopped firing for this repo (both
// scraper.yml and a fresh scraper-cron.yml sat with zero automatic runs
// for hours - a GitHub-side scheduler issue, not a workflow config problem).
// Dispatches the workflow via GitHub's REST API instead of waiting on cron.
export async function GET(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.SCRAPER_DISPATCH_PAT) {
    return NextResponse.json({ error: 'Missing SCRAPER_DISPATCH_PAT' }, { status: 500 });
  }

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SCRAPER_DISPATCH_PAT}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main' }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: 'GitHub dispatch failed', status: res.status, body }, { status: 502 });
  }

  return NextResponse.json({ dispatched: true, at: new Date().toISOString() });
}
