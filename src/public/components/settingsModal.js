/**
 * Settings Modal Component
 * Opens when clicking the gear icon on a card.
 * Shows the custom instructions (system prompt) used to generate that article.
 * Allows the user to edit and apply new instructions.
 */
export function renderSettingsModal() {
  return `
    <div id="settings-modal-backdrop" class="modal-backdrop"></div>
    <div id="settings-modal-panel" class="modal-panel">
      <div class="modal-content" style="max-width: 40rem;">
        <div class="px-8 py-6 border-b border-outline-variant/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">tune</span>
              <div>
                <h3 class="text-xl font-bold text-on-surface tracking-tight">Generation Instructions</h3>
                <p id="settings-modal-type-label" class="text-sm text-on-surface-variant mt-0.5">Article Type</p>
              </div>
            </div>
            <button id="btn-close-settings-modal" class="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95">
              <span class="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
        </div>
        <div class="px-8 py-6">
          <div class="mb-2">
            <label for="settings-prompt-textarea" class="block text-sm font-semibold text-on-surface mb-2">System Prompt</label>
            <p class="text-xs text-on-surface-variant mb-3">This is the instruction sent to the AI model. Edit it to change the tone, style, length, or focus of the generated article.</p>
            <textarea
              id="settings-prompt-textarea"
              rows="10"
              class="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm leading-relaxed resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono"
            ></textarea>
          </div>
          <div class="flex items-center gap-3 justify-end mt-6">
            <button id="btn-reset-settings" class="text-on-surface-variant font-bold text-sm px-6 py-3 hover:bg-surface-container-low rounded-full transition-colors">
              Reset to Default
            </button>
            <button id="btn-apply-settings" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check</span>
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

let _currentType = null;
let _callbacks = {};

export function openSettingsModal(type, currentPrompt, typeMeta) {
  const backdrop = document.getElementById('settings-modal-backdrop');
  const panel = document.getElementById('settings-modal-panel');
  const textarea = document.getElementById('settings-prompt-textarea');
  const label = document.getElementById('settings-modal-type-label');

  _currentType = type;
  textarea.value = currentPrompt || '';
  label.textContent = typeMeta?.title || type;

  backdrop.classList.add('active');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => textarea.focus(), 350);
}

export function closeSettingsModal() {
  const backdrop = document.getElementById('settings-modal-backdrop');
  const panel = document.getElementById('settings-modal-panel');

  backdrop.classList.remove('active');
  panel.classList.remove('active');
  document.body.style.overflow = '';
  _currentType = null;
}

export function mountSettingsModal(callbacks) {
  _callbacks = callbacks;

  document.getElementById('btn-close-settings-modal').addEventListener('click', closeSettingsModal);
  document.getElementById('settings-modal-backdrop').addEventListener('click', closeSettingsModal);

  document.getElementById('btn-apply-settings').addEventListener('click', () => {
    const newPrompt = document.getElementById('settings-prompt-textarea').value.trim();
    if (_currentType && newPrompt) {
      callbacks.onApply(_currentType, newPrompt);
    }
    closeSettingsModal();
  });

  document.getElementById('btn-reset-settings').addEventListener('click', () => {
    if (_currentType && callbacks.onReset) {
      callbacks.onReset(_currentType);
      closeSettingsModal();
    }
  });
}
