'use server';

import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { getEditor } from '@/lib/dal';
import { articleEmailHTML, articleEmailText } from '@/lib/email-template';
import { revalidatePath } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://c3-magazine.vercel.app';

/**
 * Send an article to all confirmed subscribers via Resend.
 * Returns { ok, sent, total, failed } on success.
 */
export async function sendToSubscribers(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const articleId = String(formData.get('article_id') || '');
  if (!articleId) return { error: 'Article ID is required.' };

  // Fetch the article using a service-role client (so we can read even if
  // the article is a draft — the editor is choosing to send it).
  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: article, error: articleError } = await adminClient
    .from('articles')
    .select(`
      id, slug, title, subtitle, summary, publish_date, reading_time,
      category:categories ( name, color_token ),
      author:authors ( name )
    `)
    .eq('id', articleId)
    .single();

  if (articleError || !article) {
    return { error: 'Could not find that article.' };
  }

  // Fetch all subscribers (confirmed, not unsubscribed)
  const { data: subscribers, error: subError } = await adminClient
    .from('subscribers')
    .select('email')
    .eq('confirmed', true)
    .is('unsubscribed_at', null);

  if (subError) {
    return { error: 'Could not fetch subscriber list.' };
  }

  if (!subscribers || subscribers.length === 0) {
    return { error: 'No confirmed subscribers to send to yet.' };
  }

  // Build the article object for the template
  const articleData = {
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    summary: article.summary,
    publishDate: article.publish_date,
    readingTime: article.reading_time,
    categoryName: article.category?.name,
    category: article.category?.color_token,
    authorName: article.author?.name,
    authorObj: article.author ? { name: article.author.name } : null,
  };

  const html = articleEmailHTML({ article: articleData, baseUrl: BASE_URL });
  const text = articleEmailText({ article: articleData, baseUrl: BASE_URL });

  // Send via Resend API in batches of 50 (BCC to protect privacy)
  const BATCH_SIZE = 50;
  const batches = [];
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    batches.push(subscribers.slice(i, i + BATCH_SIZE));
  }

  let sent = 0;
  let failed = 0;

  for (const batch of batches) {
    const toEmails = batch.map((s) => s.email);
    const primary = toEmails[0];
    const bcc = toEmails.slice(1);

    // Replace unsubscribe placeholder for the primary recipient
    const personalizedHtml = html.replace(
      '[UNSUBSCRIBE_URL]',
      `${BASE_URL}/unsubscribe?email=${encodeURIComponent(primary)}`,
    );
    const personalizedText = text.replace(
      '[UNSUBSCRIBE_URL]',
      `${BASE_URL}/unsubscribe?email=${encodeURIComponent(primary)}`,
    );

    // For BCC recipients, the unsubscribe URL is generic
    // (Resend doesn't support per-BCC-recipient personalization)
    const genericUnsub = `${BASE_URL}/unsubscribe`;
    const bccHtml = html.replace('[UNSUBSCRIBE_URL]', genericUnsub);
    const bccText = text.replace('[UNSUBSCRIBE_URL]', genericUnsub);

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'c³ Magazine <onboarding@resend.dev>',
          to: primary,
          ...(bcc.length > 0 ? { bcc } : {}),
          subject: `c³ — ${article.title}`,
          html: personalizedHtml,
          text: personalizedText,
        }),
      });

      if (res.ok) {
        sent += batch.length;
      } else {
        const errBody = await res.text();
        console.error('Resend error:', errBody);
        failed += batch.length;
      }
    } catch (err) {
      console.error('Resend fetch error:', err.message);
      failed += batch.length;
    }
  }

  if (failed > 0 && sent === 0) {
    return { error: `Failed to send to all ${failed} subscribers.` };
  }

  revalidatePath('/', 'layout');
  return {
    ok: true,
    message: `Sent to ${sent} subscriber${sent !== 1 ? 's' : ''}${failed > 0 ? ` (${failed} failed)` : ''}.`,
  };
}
