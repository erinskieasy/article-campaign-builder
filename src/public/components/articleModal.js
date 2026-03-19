/**
 * Article Modal Component
 * Full-screen overlay to read a generated article.
 */

/**
 * Simple Markdown-to-HTML converter (no dependencies).
 */
function markdownToHtml(md) {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Line breaks → paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  // Group consecutive <li> into <ul>
  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return html;
}

export function renderArticleModal() {
  return `
    <div id="article-modal-backdrop" class="modal-backdrop"></div>
    <div id="article-modal-panel" class="modal-panel">
      <div class="modal-content">
        <div class="sticky top-0 bg-white/90 backdrop-blur-lg px-8 py-5 border-b border-outline-variant/10 flex items-center justify-between z-10 rounded-t-[1.5rem]">
          <div class="flex items-center gap-3">
            <span id="article-modal-icon" class="material-symbols-outlined text-primary">article</span>
            <span id="article-modal-type" class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Article</span>
          </div>
          <button id="btn-close-article-modal" class="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95">
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div id="article-modal-body" class="article-rendered px-8 py-8">
          <!-- Article content injected here -->
        </div>
      </div>
    </div>
  `;
}

export function openArticleModal(article, typeMeta) {
  const backdrop = document.getElementById('article-modal-backdrop');
  const panel = document.getElementById('article-modal-panel');
  const body = document.getElementById('article-modal-body');
  const icon = document.getElementById('article-modal-icon');
  const typeLabel = document.getElementById('article-modal-type');

  icon.textContent = typeMeta?.icon || 'article';
  typeLabel.textContent = typeMeta?.title || 'Article';
  body.innerHTML = markdownToHtml(article.content);

  backdrop.classList.add('active');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeArticleModal() {
  const backdrop = document.getElementById('article-modal-backdrop');
  const panel = document.getElementById('article-modal-panel');

  backdrop.classList.remove('active');
  panel.classList.remove('active');
  document.body.style.overflow = '';
}

export function mountArticleModal() {
  document.getElementById('btn-close-article-modal').addEventListener('click', closeArticleModal);
  document.getElementById('article-modal-backdrop').addEventListener('click', closeArticleModal);
}
