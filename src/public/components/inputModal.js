/**
 * Input Modal Component
 * Modal with a textarea to paste the main source paper, OR upload a PDF.
 * PDF parsing happens entirely client-side via Mozilla pdf.js (CDN).
 */

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
let pdfjsLib = null; // lazy-loaded on first use

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const mod = await import(PDFJS_CDN);
  mod.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
  pdfjsLib = mod;
  return pdfjsLib;
}

// ─── State helpers ──────────────────────────────────────────
function setZoneState(zone, state) {
  zone.classList.remove('loading', 'success', 'error', 'dragover');
  if (state) zone.classList.add(state);
}

function resetDropZone() {
  const zone = document.getElementById('pdf-drop-zone');
  const inner = document.getElementById('pdf-zone-inner');
  const clearBtn = document.getElementById('pdf-clear-btn');
  setZoneState(zone, null);
  clearBtn.style.display = 'none';
  inner.innerHTML = `
    <span class="material-symbols-outlined drop-icon">upload_file</span>
    <p class="text-sm font-semibold text-on-surface-variant mt-2">Drop a PDF here, or click to browse</p>
    <p class="text-xs text-on-surface-variant/60 mt-1">Supports .pdf files</p>
  `;
}

// ─── Render ─────────────────────────────────────────────────
export function renderInputModal() {
  return `
    <div id="input-modal-backdrop" class="modal-backdrop"></div>
    <div id="input-modal-panel" class="modal-panel">
      <div class="modal-content" style="max-width: 40rem;">
        <div class="px-8 py-6 border-b border-outline-variant/10">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-on-surface tracking-tight">Import Source Article</h3>
              <p class="text-sm text-on-surface-variant mt-1">Upload a PDF or paste the full text of your research paper.</p>
            </div>
            <button id="btn-close-input-modal" class="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95">
              <span class="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
        </div>
        <div class="px-8 py-6">
          <!-- PDF Drop Zone -->
          <div id="pdf-drop-zone" class="pdf-drop-zone mb-4">
            <input id="pdf-file-input" type="file" accept=".pdf" class="hidden" />
            <button id="pdf-clear-btn" class="pdf-clear-btn" style="display:none;" title="Clear uploaded file">
              <span class="material-symbols-outlined" style="font-size:1.125rem;">close</span>
            </button>
            <div id="pdf-zone-inner">
              <span class="material-symbols-outlined drop-icon">upload_file</span>
              <p class="text-sm font-semibold text-on-surface-variant mt-2">Drop a PDF here, or click to browse</p>
              <p class="text-xs text-on-surface-variant/60 mt-1">Supports .pdf files</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="pdf-divider mb-4">or paste text</div>

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
              rows="8"
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

// ─── PDF Extraction ─────────────────────────────────────────
async function extractTextFromPdf(file) {
  const lib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    pages.push(strings.join(' '));
  }

  return { text: pages.join('\n\n'), numPages: pdf.numPages };
}

async function handlePdfFile(file) {
  const zone = document.getElementById('pdf-drop-zone');
  const inner = document.getElementById('pdf-zone-inner');
  const clearBtn = document.getElementById('pdf-clear-btn');
  const titleInput = document.getElementById('input-title');
  const textArea = document.getElementById('input-source-text');

  // Show loading
  setZoneState(zone, 'loading');
  inner.innerHTML = `
    <span class="spinner" style="width:1.5rem;height:1.5rem;border-width:2px;"></span>
    <p class="text-sm font-semibold text-on-surface-variant mt-3">Extracting text from PDF…</p>
    <p class="text-xs text-on-surface-variant/60 mt-1">${file.name}</p>
  `;

  try {
    const { text, numPages } = await extractTextFromPdf(file);

    if (!text.trim()) {
      throw new Error('No extractable text found in this PDF. It may be image-based or scanned.');
    }

    // Success
    textArea.value = text;
    textArea.style.borderColor = '';

    // Auto-fill title if empty
    if (!titleInput.value.trim()) {
      const baseName = file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ');
      titleInput.value = baseName;
    }

    setZoneState(zone, 'success');
    clearBtn.style.display = '';
    inner.innerHTML = `
      <span class="material-symbols-outlined drop-icon">check_circle</span>
      <p class="text-sm font-semibold text-on-surface mt-2">${file.name}</p>
      <p class="text-xs text-on-surface-variant/60 mt-1">${numPages} page${numPages !== 1 ? 's' : ''} · ${text.length.toLocaleString()} characters extracted</p>
    `;
  } catch (err) {
    console.error('[PDF] Extraction error:', err);
    setZoneState(zone, 'error');
    inner.innerHTML = `
      <span class="material-symbols-outlined drop-icon">error</span>
      <p class="text-sm font-semibold text-on-surface mt-2">Failed to extract text</p>
      <p class="text-xs text-on-surface-variant/60 mt-1">${err.message}</p>
    `;
    clearBtn.style.display = '';
  }
}

// ─── Mount ──────────────────────────────────────────────────
export function mountInputModal(callbacks) {
  document.getElementById('btn-close-input-modal').addEventListener('click', closeInputModal);
  document.getElementById('input-modal-backdrop').addEventListener('click', closeInputModal);
  document.getElementById('btn-cancel-input').addEventListener('click', closeInputModal);

  // Submit
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

  // ─── PDF Drop-Zone wiring ──────────────────────────────
  const zone = document.getElementById('pdf-drop-zone');
  const fileInput = document.getElementById('pdf-file-input');
  const clearBtn = document.getElementById('pdf-clear-btn');

  // Click to browse
  zone.addEventListener('click', (e) => {
    if (e.target.closest('#pdf-clear-btn')) return; // don't trigger file picker on clear
    fileInput.click();
  });

  // File selected via picker
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handlePdfFile(fileInput.files[0]);
    }
  });

  // Drag & drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handlePdfFile(file);
    } else {
      setZoneState(zone, 'error');
      const inner = document.getElementById('pdf-zone-inner');
      inner.innerHTML = `
        <span class="material-symbols-outlined drop-icon">error</span>
        <p class="text-sm font-semibold text-on-surface mt-2">Invalid file type</p>
        <p class="text-xs text-on-surface-variant/60 mt-1">Please upload a .pdf file</p>
      `;
      document.getElementById('pdf-clear-btn').style.display = '';
    }
  });

  // Clear button
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    document.getElementById('input-source-text').value = '';
    resetDropZone();
  });
}
