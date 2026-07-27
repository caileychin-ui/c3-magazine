import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getEditor } from '@/lib/dal';

/**
 * POST /api/upload-pdf
 * Uploads a PDF to the pdfs storage bucket. Requires editor session.
 * Uses the service role key for storage (the editor check is the gate).
 */
export async function POST(request) {
  const editor = await getEditor();
  if (!editor) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('pdf_file');
  const articleId = String(formData.get('article_id') || 'new');

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file selected' }, { status: 400 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const fileName = `${articleId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;

  const { error } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file, { contentType: 'application/pdf', upsert: true });

  if (error) {
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(fileName);
  return NextResponse.json({ url: urlData.publicUrl });
}
