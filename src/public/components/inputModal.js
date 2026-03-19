/**
 * Input Modal Component
 * Modal with a textarea to paste the main source paper.
 */
export function renderInputModal() {
  return `
    <div id="input-modal-backdrop" class="modal-backdrop"></div>
    <div id="input-modal-panel" class="modal-panel">
      <div class="modal-content" style="max-width: 40rem;">
        <div class="px-8 py-6 border-b border-outline-variant/10">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-on-surface tracking-tight">Paste Source Article</h3>
              <p class="text-sm text-on-surface-variant mt-1">Paste the full text of your research paper or article below.</p>
            </div>
            <button id="btn-close-input-modal" class="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95">
              <span class="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
        </div>
        <div class="px-8 py-6">
          <div class="mb-4">
            <label for="input-title" class="block text-sm font-semibold text-on-surface mb-2">Article Title</label>
            <input
              id="input-title"
              type="text"
              placeholder="e.g. The Future of Quantum Computing"
              class="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div class="mb-6">
            <label for="input-source-text" class="block text-sm font-semibold text-on-surface mb-2">Full Article Text</label>
            <textarea
              id="input-source-text"
              rows="12"
              placeholder="Paste the full text of your paper here..."
              class="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm leading-relaxed resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            ></textarea>
          </div>
          <div class="flex items-center gap-3 justify-end">
            <button id="btn-cancel-input" class="text-on-surface-variant font-bold text-sm px-6 py-3 hover:bg-surface-container-low rounded-full transition-colors">
              Cancel
            </button>
            <button id="btn-submit-source" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check</span>
              Load Article
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openInputModal() {
  const backdrop = document.getElementById('input-modal-backdrop');
  const panel = document.getElementById('input-modal-panel');

  backdrop.classList.add('active');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus the title input after animation
  setTimeout(() => document.getElementById('input-title')?.focus(), 350);
}

export function closeInputModal() {
  const backdrop = document.getElementById('input-modal-backdrop');
  const panel = document.getElementById('input-modal-panel');

  backdrop.classList.remove('active');
  panel.classList.remove('active');
  document.body.style.overflow = '';
}

export function mountInputModal(callbacks) {
  document.getElementById('btn-close-input-modal').addEventListener('click', closeInputModal);
  document.getElementById('input-modal-backdrop').addEventListener('click', closeInputModal);
  document.getElementById('btn-cancel-input').addEventListener('click', closeInputModal);

  document.getElementById('btn-submit-source').addEventListener('click', () => {
    const title = document.getElementById('input-title').value.trim();
    const text = document.getElementById('input-source-text').value.trim();

    if (!text) {
      document.getElementById('input-source-text').style.borderColor = '#9f403d';
      return;
    }

    callbacks.onSubmit({ title, text });
    closeInputModal();
  });
}
