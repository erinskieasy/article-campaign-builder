/**
 * Sub Card Component
 * Reusable branching sub-article card with Open/Generate buttons.
 */

const TYPE_META = {
  'non-technical': { icon: 'lightbulb', title: 'Non-Technical Article', desc: 'Breaking down complex ideas into everyday analogies for a general audience.' },
  'commentary':    { icon: 'chat_bubble', title: 'Commentary Blog Post', desc: 'A critical take on the societal implications and industry shifts.' },
  'ai-focused':    { icon: 'memory', title: 'AI-Focused Slant', desc: 'Exploring the intersection with artificial intelligence and machine learning.' },
  'trending-news': { icon: 'public', title: 'Trending Global News', desc: 'Concise, impactful reporting on the international implications.' }
};

export function renderSubCards(state) {
  const types = Object.keys(TYPE_META);
  const cards = types.map((type, i) => {
    const meta = TYPE_META[type];
    const article = state.articles[type];
    const isGenerating = state.generating[type];
    const hasContent = article && article.content;
    const hasError = article && article.error;

    let statusBadge = '';
    if (hasContent) {
      statusBadge = `<span class="status-badge status-generated"><span class="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Generated</span>`;
    } else if (hasError) {
      statusBadge = `<span class="status-badge status-error">Error</span>`;
    }

    return `
      <div class="sub-card bg-surface-container-low rounded-md p-6 hover:bg-surface-container-high transition-all group animate-in animate-in-delay-${i + 1}" data-type="${type}">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-primary">${meta.icon}</span>
          </div>
          ${statusBadge}
        </div>
        <h3 class="text-lg font-bold text-on-surface mb-3 tracking-tight">${meta.title}</h3>
        <p class="text-sm text-on-surface-variant leading-relaxed mb-8">${meta.desc}</p>
        <div class="flex items-center gap-2 mt-auto">
          <button
            class="btn-open-article bg-surface-container-lowest text-primary text-xs font-bold px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-primary hover:text-on-primary transition-all ${hasContent ? '' : 'opacity-40 pointer-events-none'}"
            data-type="${type}"
            ${hasContent ? '' : 'disabled'}
          >Open</button>
          <button
            class="btn-generate-article bg-surface-container-lowest text-on-surface-variant text-xs font-bold px-4 py-2 rounded-full border border-outline-variant/20 group-hover:bg-primary-container group-hover:text-on-primary-container group-hover:border-transparent transition-all ${isGenerating ? 'generating' : ''}"
            data-type="${type}"
            ${isGenerating ? 'disabled' : ''}
          >
            ${isGenerating ? '<span class="spinner"></span> Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    `;
  });

  return `
    <div id="sub-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      ${cards.join('')}
    </div>
  `;
}

export function mountSubCards(callbacks) {
  document.querySelectorAll('.btn-open-article').forEach(btn => {
    btn.addEventListener('click', () => callbacks.onOpen(btn.dataset.type));
  });

  document.querySelectorAll('.btn-generate-article').forEach(btn => {
    btn.addEventListener('click', () => callbacks.onGenerate(btn.dataset.type));
  });
}
