/**
 * Sub Card Component
 * Reusable branching sub-article card with Open/Generate/Download/Settings buttons.
 * Now supports dynamic custom types alongside built-in types.
 */

const DEFAULT_TYPE_META = {
  'non-technical': { icon: 'lightbulb', title: 'Non-Technical Article', desc: 'Breaking down complex ideas into everyday analogies for a general audience.' },
  'commentary':    { icon: 'chat_bubble', title: 'Commentary Blog Post', desc: 'A critical take on the societal implications and industry shifts.' },
  'ai-focused':    { icon: 'memory', title: 'AI-Focused Slant', desc: 'Exploring the intersection with artificial intelligence and machine learning.' },
  'trending-news': { icon: 'public', title: 'Trending Global News', desc: 'Concise, impactful reporting on the international implications.' }
};

export function renderSubCards(state) {
  // Merge built-in types with any user-created custom types
  const allTypes = { ...DEFAULT_TYPE_META, ...(state.customTypes || {}) };
  const types = Object.keys(allTypes);
  const totalCards = types.length;

  const cards = types.map((type, i) => {
    const meta = allTypes[type];
    const article = state.articles[type];
    const isGenerating = state.generating[type];
    const hasContent = article && article.content;
    const hasError = article && article.error;
    const isCustom = !DEFAULT_TYPE_META[type];

    let statusBadge = '';
    if (hasContent) {
      statusBadge = `<span class="status-badge status-generated"><span class="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Generated</span>`;
    } else if (hasError) {
      statusBadge = `<span class="status-badge status-error">Error</span>`;
    }

    return `
      <div class="sub-card bg-surface-container-low rounded-md p-6 hover:bg-surface-container-high transition-all group animate-in animate-in-delay-${(i % 4) + 1}" data-type="${type}">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-primary">${meta.icon}</span>
          </div>
          <div class="flex items-center gap-2">
            ${statusBadge}
            <button
              class="btn-settings-article p-1.5 rounded-full hover:bg-surface-container transition-all opacity-0 group-hover:opacity-100"
              data-type="${type}"
              title="Edit instructions"
            >
              <span class="material-symbols-outlined text-on-surface-variant" style="font-size: 18px;">settings</span>
            </button>
            ${isCustom ? `
              <button
                class="btn-delete-card p-1.5 rounded-full hover:bg-error-container/40 transition-all opacity-0 group-hover:opacity-100"
                data-type="${type}"
                title="Remove card"
              >
                <span class="material-symbols-outlined text-error" style="font-size: 18px;">close</span>
              </button>
            ` : ''}
          </div>
        </div>
        <h3 class="text-lg font-bold text-on-surface mb-3 tracking-tight">${meta.title}</h3>
        <p class="text-sm text-on-surface-variant leading-relaxed mb-8">${meta.desc}</p>
        <div class="flex items-center gap-2 mt-auto flex-wrap">
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
          <button
            class="btn-download-article bg-surface-container-lowest text-on-surface-variant text-xs font-bold px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container-high transition-all ${hasContent ? '' : 'opacity-40 pointer-events-none'}"
            data-type="${type}"
            ${hasContent ? '' : 'disabled'}
            title="Download as Markdown"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">download</span>
          </button>
        </div>
      </div>
    `;
  });

  // "Add New Card" button at the end
  const addCard = `
    <div class="add-card-btn sub-card bg-surface-container-low/50 rounded-md p-6 border-2 border-dashed border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[240px] animate-in animate-in-delay-${(totalCards % 4) + 1}" id="btn-add-new-card">
      <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-primary">add</span>
      </div>
      <h3 class="text-base font-bold text-on-surface-variant mb-1">New Card</h3>
      <p class="text-xs text-on-surface-variant/70">Custom article format</p>
    </div>
  `;

  return `
    <div id="sub-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      ${cards.join('')}
      ${addCard}
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

  document.querySelectorAll('.btn-download-article').forEach(btn => {
    btn.addEventListener('click', () => callbacks.onDownload(btn.dataset.type));
  });

  document.querySelectorAll('.btn-settings-article').forEach(btn => {
    btn.addEventListener('click', () => callbacks.onSettings(btn.dataset.type));
  });

  document.querySelectorAll('.btn-delete-card').forEach(btn => {
    btn.addEventListener('click', () => callbacks.onDeleteCard(btn.dataset.type));
  });

  const addBtn = document.getElementById('btn-add-new-card');
  if (addBtn) addBtn.addEventListener('click', callbacks.onAddCard);
}
