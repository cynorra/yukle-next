import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const isSecretParamValid = secret === cronSecret;
    const isAuthHeaderValid = authHeader === `Bearer ${cronSecret}`;

    if (!isSecretParamValid && !isAuthHeaderValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    console.log('Triggering logistics scraper cron job...');
    // Use require to dynamically load the Node.js scraping script at runtime
    // @ts-ignore
    const { runScraper } = require('../../../../../scripts/scraper');
    const totalInserted = await runScraper();

    return NextResponse.json({
      success: true,
      message: `Scraper execution successful. Imported ${totalInserted} new loads.`
    });
  } catch (error: any) {
    console.error('Error triggered in scrape API route:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Scraper Error'
    }, { status: 500 });
  }
}
