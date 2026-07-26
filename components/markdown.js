/**
 * Minimal markdown renderer — handles headings, bold, italic,
 * blockquotes, lists, links, and paragraphs. No external deps.
 */
function renderInline(text) {
  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text* (avoid matching ** which is bold)
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
  // Footnote markers [^n]
  text = text.replace(/\[\^(\d+)\]/g, '<sup><a href="#cite-$1">[$1]</a></sup>');
  return text;
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;
  
  const lines = content.split('\n');
  const blocks = [];
  let currentList = null;
  let currentListType = null;
  let blockquote = null;

  function flushList() {
    if (currentList) {
      blocks.push({ type: currentListType === 'ol' ? 'ol' : 'ul', items: currentList });
      currentList = null;
      currentListType = null;
    }
  }
  function flushBlockquote() {
    if (blockquote) {
      blocks.push({ type: 'blockquote', html: blockquote.join('<br/>') });
      blockquote = null;
    }
  }

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      flushList();
      flushBlockquote();
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,3})\s+(.*)/);
    if (h) {
      flushList();
      flushBlockquote();
      const level = h[1].length;
      blocks.push({ type: `h${level}`, html: renderInline(h[2]) });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      if (!blockquote) blockquote = [];
      blockquote.push(renderInline(line.slice(2)));
      continue;
    }
    flushBlockquote();

    // Ordered list
    const ol = line.match(/^(\d+)\.\s+(.*)/);
    if (ol) {
      if (!currentList || currentListType !== 'ol') {
        flushList();
        currentList = [];
        currentListType = 'ol';
      }
      currentList.push(renderInline(ol[2]));
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s+(.*)/)) {
      if (!currentList || currentListType !== 'ul') {
        flushList();
        currentList = [];
        currentListType = 'ul';
      }
      currentList.push(renderInline(line.replace(/^[-*]\s+/, '')));
      continue;
    }
    flushList();

    // Paragraph
    blocks.push({ type: 'p', html: renderInline(line) });
  }

  flushList();
  flushBlockquote();

  return (
    <div className="c3-article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h1': return <h1 key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
          case 'h2': return <h2 key={i} dangerouslySetInnerHTML={{ __html: b.html }} style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '28px 0 12px' }} />;
          case 'h3': return <h3 key={i} dangerouslySetInnerHTML={{ __html: b.html }} style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '22px 0 10px' }} />;
          case 'p': return <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} style={{ fontSize: 18, lineHeight: 1.7, margin: '0 0 18px' }} />;
          case 'blockquote': return <blockquote key={i} dangerouslySetInnerHTML={{ __html: b.html }} style={{ borderLeft: '3px solid var(--ink)', margin: '20px 0', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: 18, fontStyle: 'italic', color: 'var(--text-secondary)' }} />;
          case 'ul': return <ul key={i} style={{ margin: '0 0 18px', paddingLeft: 24 }}>{b.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: 18, lineHeight: 1.7, margin: '4px 0' }} />)}</ul>;
          case 'ol': return <ol key={i} style={{ margin: '0 0 18px', paddingLeft: 24 }}>{b.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: 18, lineHeight: 1.7, margin: '4px 0' }} />)}</ol>;
          default: return null;
        }
      })}
    </div>
  );
}
