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
    console.log('Triggering automated blog generator cron job...');
    // @ts-ignore
    const { runBlogGenerator } = require('../../../../../scripts/blog-generator');
    const posts = await runBlogGenerator();
    const mainPost = Array.isArray(posts) ? posts[0] : posts;

    return NextResponse.json({
      success: true,
      message: `Blog posts published successfully. Total: ${Array.isArray(posts) ? posts.length : 1}`,
      post: mainPost ? {
        id: mainPost.id,
        title: mainPost.title,
        slug: mainPost.slug
      } : null
    });
  } catch (error: any) {
    console.error('Error triggered in blog API route:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Blog Generator Error'
    }, { status: 500 });
  }
}
