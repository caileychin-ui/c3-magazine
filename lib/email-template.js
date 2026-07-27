/**
 * Email template for new article notifications.
 * Matches the c³ Magazine brand: cream background, pastel accents, bold display type.
 */

export function articleEmailHTML({ article, baseUrl = 'https://c3-magazine.vercel.app' }) {
  const articleUrl = `${baseUrl}/articles/${article.slug}`;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(article.title)}</title>
</head>
<body style="margin:0;padding:0;background:#FFFDF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFE45E;border-bottom:3px solid #111;">
    <tr><td align="center" style="padding:24px 20px;">
      <a href="${baseUrl}" style="text-decoration:none;color:#111;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
        c³
      </a>
    </td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Category badge -->
        <tr><td style="padding-bottom:16px;">
          <span style="display:inline-block;background:#E4F4FF;color:#0B5E8F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;padding:6px 14px;border-radius:999px;">
            ${escapeHtml(article.categoryName || article.category || 'New article')}
          </span>
        </td></tr>

        <!-- Title -->
        <tr><td style="padding-bottom:12px;">
          <h1 style="font-size:32px;line-height:1.15;margin:0;font-weight:700;color:#111;">
            ${escapeHtml(article.title)}
          </h1>
        </td></tr>

        <!-- Subtitle -->
        ${article.subtitle ? `
        <tr><td style="padding-bottom:20px;">
          <p style="font-size:18px;line-height:1.5;margin:0;color:#4A4740;">
            ${escapeHtml(article.subtitle)}
          </p>
        </td></tr>` : ''}

        <!-- Meta -->
        <tr><td style="padding-bottom:24px;border-bottom:1px solid #E3E0D8;">
          <p style="font-size:14px;color:#79756B;margin:0;">
            ${article.authorObj?.name || article.authorName || ''}
            ${article.publishDate ? ` · ${article.publishDate}` : ''}
            ${article.readingTime ? ` · ${article.readingTime}` : ''}
          </p>
        </td></tr>

        <!-- Summary / excerpt -->
        ${article.summary ? `
        <tr><td style="padding-top:24px;padding-bottom:28px;">
          <p style="font-size:16px;line-height:1.6;margin:0;color:#4A4740;">
            ${escapeHtml(article.summary)}
          </p>
        </td></tr>` : ''}

        <!-- CTA button -->
        <tr><td style="padding-bottom:36px;" align="center">
          <a href="${articleUrl}" style="display:inline-block;background:#111;color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;">
            Read the full article →
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding-top:20px;border-top:1px solid #E3E0D8;">
          <p style="font-size:13px;color:#79756B;margin:0;text-align:center;line-height:1.5;">
            You're receiving this because you subscribed to c³ Magazine.<br>
            <a href="${baseUrl}" style="color:#0B5E8F;">c3-magazine.vercel.app</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>

  <!-- Footer / unsubscribe -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EC;">
    <tr><td align="center" style="padding:28px 20px;">
      <p style="font-size:12px;color:#79756B;margin:0;">
        <a href="[UNSUBSCRIBE_URL]" style="color:#79756B;text-decoration:underline;">Unsubscribe</a>
        &nbsp;·&nbsp;
        c³ Magazine
      </p>
    </td></tr>
  </table>

</body>
</html>`;
}

export function articleEmailText({ article, baseUrl = 'https://c3-magazine.vercel.app' }) {
  const articleUrl = `${baseUrl}/articles/${article.slug}`;
  return [
    `c³ — New article published`,
    ``,
    `${article.title}`,
    article.subtitle || '',
    ``,
    article.summary || '',
    ``,
    `Read it here: ${articleUrl}`,
    ``,
    `You're receiving this because you subscribed to c³ Magazine.`,
    `Unsubscribe: [UNSUBSCRIBE_URL]`,
  ].filter(Boolean).join('\n');
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
