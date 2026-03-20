/**
 * Help Modal Component
 * Modern step-by-step walkthrough for new users.
 */

let _currentStep = 1;
const TOTAL_STEPS = 5;

const STEPS = {
  1: {
    title: 'Welcome to The Fluid Archive',
    icon: 'auto_awesome',
    desc: 'Transform complex research papers into engaging articles designed for any audience. Let\'s walk through how to build your first campaign.'
  },
  2: {
    title: '1. Paste Your Source',
    icon: 'content_paste',
    desc: 'Start by clicking the central card to paste your research paper or article link. This becomes the "seed" for all your transformations.'
  },
  3: {
    title: '2. Mass Transformation',
    icon: 'rocket_launch',
    desc: 'Click "Generate All" to instantly create a full set of articles (Non-technical, Blog, News slanted, etc.) based on your source paper.'
  },
  4: {
    title: '3. Custom AI Controls',
    icon: 'settings_suggest',
    desc: 'Want more control? Click the Gear icon on any card to edit its AI instructions, or click the "+" button to create your own custom article types from scratch.'
  },
  5: {
    title: '4. Delivery & Notifications',
    icon: 'notifications_active',
    desc: 'Watch the notification bell! You\'ll get a ping once each generation is ready. From there, you can view or download each article individually or in batch.'
  }
};

export function renderHelpModal() {
  const step = STEPS[_currentStep];
  return `
    <div id="help-modal-backdrop" class="modal-backdrop"></div>
    <div id="help-modal-panel" class="modal-panel">
      <div class="modal-content max-w-lg p-0 overflow-hidden relative">
        <!-- Close Button -->
        <button id="btn-help-close" class="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all active:scale-95 z-10">
          <span class="material-symbols-outlined">close</span>
        </button>

        <!-- Progress Bar -->
        <div class="h-1.5 w-full bg-surface-container-low">
          <div class="h-full bg-primary transition-all duration-500 ease-out" style="width: ${(_currentStep / TOTAL_STEPS) * 100}%"></div>
        </div>

        <div class="p-10">
          <div class="flex flex-col items-center text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-bounce-subtle">
              <span class="material-symbols-outlined text-primary text-4xl">${step.icon}</span>
            </div>
            <h2 class="text-2xl font-bold text-on-surface mb-4">${step.title}</h2>
            <p class="text-on-surface-variant leading-relaxed text-lg">
              ${step.desc}
            </p>
          </div>

          <div class="flex items-center justify-between gap-4 mt-10">
            <button id="btn-help-prev" class="px-6 py-3 rounded-full font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors ${_currentStep === 1 ? 'invisible' : ''}">
              Back
            </button>
            <div class="flex gap-1.5">
              ${Array.from({ length: TOTAL_STEPS }).map((_, i) => `
                <div class="w-2 h-2 rounded-full ${i + 1 === _currentStep ? 'bg-primary' : 'bg-outline-variant/30'}"></div>
              `).join('')}
            </div>
            <button id="btn-help-next" class="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 duration-200">
              ${_currentStep === TOTAL_STEPS ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openHelpModal() {
  _currentStep = 1;
  updateHelpContent();
  const backdrop = document.getElementById('help-modal-backdrop');
  const panel = document.getElementById('help-modal-panel');
  if (backdrop && panel) {
    backdrop.classList.add('active');
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeHelpModal() {
  const backdrop = document.getElementById('help-modal-backdrop');
  const panel = document.getElementById('help-modal-panel');
  if (backdrop && panel) {
    backdrop.classList.remove('active');
    panel.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateHelpContent() {
  const modalContainer = document.getElementById('help-modal-container');
  if (modalContainer) {
    const isAlreadyActive = document.getElementById('help-modal-panel')?.classList.contains('active');
    modalContainer.innerHTML = renderHelpModal();
    mountHelpModal();
    
    // If we were already active (e.g. moving between steps), keep it active
    if (isAlreadyActive) {
      document.getElementById('help-modal-backdrop')?.classList.add('active');
      document.getElementById('help-modal-panel')?.classList.add('active');
    }
  }
}

export function mountHelpModal() {
  const btnNext = document.getElementById('btn-help-next');
  const btnPrev = document.getElementById('btn-help-prev');
  const backdrop = document.getElementById('help-modal-backdrop');

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (_currentStep < TOTAL_STEPS) {
        _currentStep++;
        updateHelpContent();
      } else {
        closeHelpModal();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (_currentStep > 1) {
        _currentStep--;
        updateHelpContent();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeHelpModal();
    });
  }

  const btnClose = document.getElementById('btn-help-close');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      closeHelpModal();
    });
  }
}
