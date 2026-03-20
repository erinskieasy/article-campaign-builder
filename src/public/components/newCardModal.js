/**
 * New Card Modal Component
 * Allows the user to create a new custom article card
 * with a custom name and generation instructions.
 */
export function renderNewCardModal() {
  return `
    <div id="newcard-modal-backdrop" class="modal-backdrop"></div>
    <div id="newcard-modal-panel" class="modal-panel">
      <div class="modal-content" style="max-width: 40rem;">
        <div class="px-8 py-6 border-b border-outline-variant/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">add_circle</span>
              <div>
                <h3 class="text-xl font-bold text-on-surface tracking-tight">New Article Card</h3>
                <p class="text-sm text-on-surface-variant mt-0.5">Define a custom article format</p>
              </div>
            </div>
            <button id="btn-close-newcard-modal" class="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95">
              <span class="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
        </div>
        <div class="px-8 py-6">
          <div class="mb-4">
            <label for="newcard-name" class="block text-sm font-semibold text-on-surface mb-2">Card Name</label>
            <input
              id="newcard-name"
              type="text"
              placeholder="e.g. Executive Summary, Social Media Thread, etc."
              class="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div class="mb-4">
            <label for="newcard-icon" class="block text-sm font-semibold text-on-surface mb-2">Icon</label>
            <div class="flex flex-wrap gap-2" id="newcard-icon-picker">
              ${['edit_note', 'campaign', 'psychology', 'school', 'biotech', 'rocket_launch', 'balance', 'brush', 'podcasts', 'trending_up', 'forum', 'translate']
                .map((icon, i) => `
                  <button class="icon-pick-btn p-2.5 rounded-xl border border-outline-variant/20 hover:bg-primary-container hover:border-primary/30 transition-all ${i === 0 ? 'bg-primary-container border-primary/30' : 'bg-surface-container-lowest'}" data-icon="${icon}">
                    <span class="material-symbols-outlined text-primary">${icon}</span>
                  </button>
                `).join('')}
            </div>
          </div>
          <div class="mb-6">
            <label for="newcard-instructions" class="block text-sm font-semibold text-on-surface mb-2">Custom Instructions</label>
            <p class="text-xs text-on-surface-variant mb-3">Tell the AI how to transform the source article. Be specific about tone, audience, length, and format.</p>
            <textarea
              id="newcard-instructions"
              rows="8"
              placeholder="e.g. You are a social media strategist. Turn the following paper into a thread of 10 tweets, each under 280 characters. Make them punchy and shareable..."
              class="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm leading-relaxed resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            ></textarea>
          </div>
          <div class="flex items-center gap-3 justify-end">
            <button id="btn-cancel-newcard" class="text-on-surface-variant font-bold text-sm px-6 py-3 hover:bg-surface-container-low rounded-full transition-colors">
              Cancel
            </button>
            <button id="btn-create-newcard" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">add</span>
              Create Card
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openNewCardModal() {
  const backdrop = document.getElementById('newcard-modal-backdrop');
  const panel = document.getElementById('newcard-modal-panel');

  // Reset fields
  document.getElementById('newcard-name').value = '';
  document.getElementById('newcard-instructions').value = '';

  backdrop.classList.add('active');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('newcard-name')?.focus(), 350);
}

export function closeNewCardModal() {
  const backdrop = document.getElementById('newcard-modal-backdrop');
  const panel = document.getElementById('newcard-modal-panel');

  backdrop.classList.remove('active');
  panel.classList.remove('active');
  document.body.style.overflow = '';
}

export function mountNewCardModal(callbacks) {
  document.getElementById('btn-close-newcard-modal').addEventListener('click', closeNewCardModal);
  document.getElementById('newcard-modal-backdrop').addEventListener('click', closeNewCardModal);
  document.getElementById('btn-cancel-newcard').addEventListener('click', closeNewCardModal);

  // Icon picker
  let selectedIcon = 'edit_note';
  document.querySelectorAll('.icon-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-pick-btn').forEach(b => {
        b.classList.remove('bg-primary-container', 'border-primary/30');
        b.classList.add('bg-surface-container-lowest');
      });
      btn.classList.add('bg-primary-container', 'border-primary/30');
      btn.classList.remove('bg-surface-container-lowest');
      selectedIcon = btn.dataset.icon;
    });
  });

  document.getElementById('btn-create-newcard').addEventListener('click', () => {
    const name = document.getElementById('newcard-name').value.trim();
    const instructions = document.getElementById('newcard-instructions').value.trim();

    if (!name) {
      document.getElementById('newcard-name').style.borderColor = '#9f403d';
      return;
    }
    if (!instructions) {
      document.getElementById('newcard-instructions').style.borderColor = '#9f403d';
      return;
    }

    callbacks.onCreate({ name, icon: selectedIcon, instructions });
    closeNewCardModal();
  });
}
