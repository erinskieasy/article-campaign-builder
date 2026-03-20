/**
 * Main Card Component
 * Central source document card with title, summary, and action buttons.
 */
export function renderMainCard(state) {
  const hasSource = state.sourceText && state.sourceText.trim().length > 0;
  const title = state.sourceTitle || 'Paste Your Article';
  const summary = state.sourceSummary || 'Click the button below to paste your research paper or article. We\'ll transform it into multiple formats using AI.';

  return `
    <div class="flex justify-start mb-24 relative z-10">
      <div class="w-full max-w-3xl bg-surface-container-lowest rounded-lg p-10 shadow-xl shadow-on-surface/5 border border-outline-variant/10 animate-in">
        <div class="flex items-start justify-between mb-8">
          <span class="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase">
            Source Document
          </span>
          ${hasSource
      ? `<span class="status-badge status-ready">
                <span class="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                Ready
              </span>`
      : `<span class="text-on-surface-variant text-sm font-medium">No document loaded</span>`
    }
        </div>

        <h2 id="main-card-title" class="text-3xl md:text-4xl font-extrabold text-on-surface mb-6 leading-tight tracking-tight">
          ${title}
        </h2>
        <p id="main-card-summary" class="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
          ${summary}
        </p>

        <div class="flex items-center gap-4">
          ${hasSource
      ? `<button id="btn-view-source" class="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                Open Paper
              </button>
              <button id="btn-change-source" class="text-primary font-bold text-sm px-6 py-3 hover:bg-surface-container-low rounded-full transition-colors">
                Replace Article
              </button>`
      : `<button id="btn-paste-article" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">content_paste</span>
                Paste Article
              </button>`
    }
        </div>
      </div>
    </div>
  `;
}

export function mountMainCard(state, callbacks) {
  const btnPaste = document.getElementById('btn-paste-article');
  const btnView = document.getElementById('btn-view-source');
  const btnChange = document.getElementById('btn-change-source');

  if (btnPaste) btnPaste.addEventListener('click', callbacks.onPasteClick);
  if (btnView) btnView.addEventListener('click', callbacks.onViewSource);
  if (btnChange) btnChange.addEventListener('click', callbacks.onPasteClick);
}
