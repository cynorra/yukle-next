import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { submitToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

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
    const allPosts = Array.isArray(posts) ? posts : [posts];
    const mainPost = allPosts[0];

    // Submit all published blog URLs to IndexNow for instant indexing
    // across Bing, Yandex, Naver, and Seznam
    if (allPosts.length > 0) {
      revalidateTag('blog-posts');
      revalidateTag('blog-post');

      const blogUrls = allPosts
        .filter((p: any) => p?.slug && p?.language)
        .map((p: any) => `${SITE_URL}/${p.language}/blog/${p.slug}`);

      if (blogUrls.length > 0) {
        console.log(`Submitting ${blogUrls.length} blog URLs to IndexNow...`);
        await submitToIndexNow(blogUrls);
        console.log('IndexNow submission complete.');
      }
    }

    return NextResponse.json({
      success: true,
      message: `Blog posts published successfully. Total: ${allPosts.length}`,
      indexNowSubmitted: allPosts.length,
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
