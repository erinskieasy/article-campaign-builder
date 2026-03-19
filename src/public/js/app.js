/**
 * App.js — Main Application Orchestrator
 * Manages state, API calls, and coordinates all UI components.
 */
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderMainCard, mountMainCard } from '../components/mainCard.js';
import { renderSubCards, mountSubCards } from '../components/subCard.js';
import { renderArticleModal, openArticleModal, mountArticleModal } from '../components/articleModal.js';
import { renderInputModal, openInputModal, mountInputModal } from '../components/inputModal.js';
import { renderConnectors } from '../components/connectors.js';

// ─── Application State ─────────────────────────────────────
const state = {
  sourceText: '',
  sourceTitle: '',
  sourceSummary: '',
  articles: {},       // { 'non-technical': { content, title, ... }, ... }
  generating: {},     // { 'non-technical': true/false, ... }
};

const TYPE_META = {
  'non-technical': { icon: 'lightbulb', title: 'Non-Technical Article' },
  'commentary':    { icon: 'chat_bubble', title: 'Commentary Blog Post' },
  'ai-focused':    { icon: 'memory', title: 'AI-Focused Slant' },
  'trending-news': { icon: 'public', title: 'Trending Global News' }
};

// ─── API Client ─────────────────────────────────────────────
async function apiGenerateOne(sourceText, type) {
  const res = await fetch('/api/articles/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceText, type })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Generation failed');
  }
  return res.json();
}

async function apiGenerateAll(sourceText) {
  const res = await fetch('/api/articles/generate-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceText })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Generation failed');
  }
  return res.json();
}

// ─── Render Engine ──────────────────────────────────────────
function render() {
  const mainContent = document.getElementById('main-content');
  const cardSection = document.getElementById('card-section');

  // Re-render the main card area
  mainContent.innerHTML = renderMainCard(state);
  mountMainCard(state, {
    onPasteClick: () => openInputModal(),
    onViewSource: () => {
      // Show source article in the article modal
      openArticleModal(
        { content: state.sourceText, title: state.sourceTitle },
        { icon: 'description', title: 'Source Document' }
      );
    }
  });

  // Re-render sub-cards
  cardSection.innerHTML = renderConnectors() + renderSubCards(state);
  mountSubCards({
    onOpen: (type) => {
      const article = state.articles[type];
      if (article && article.content) {
        openArticleModal(article, TYPE_META[type]);
      }
    },
    onGenerate: (type) => handleGenerate(type)
  });
}

// ─── Event Handlers ─────────────────────────────────────────
async function handleGenerate(type) {
  if (!state.sourceText) {
    openInputModal();
    return;
  }

  state.generating[type] = true;
  render();

  try {
    const result = await apiGenerateOne(state.sourceText, type);
    state.articles[type] = result.article;
  } catch (err) {
    state.articles[type] = { error: err.message, type };
    console.error(`[Generate ${type}] Error:`, err.message);
  }

  state.generating[type] = false;
  render();
}

async function handleGenerateAll() {
  if (!state.sourceText) {
    openInputModal();
    return;
  }

  // Mark all as generating
  Object.keys(TYPE_META).forEach(t => { state.generating[t] = true; });
  render();

  try {
    const result = await apiGenerateAll(state.sourceText);
    Object.entries(result.articles).forEach(([type, article]) => {
      state.articles[type] = article;
    });
  } catch (err) {
    console.error('[GenerateAll] Error:', err.message);
  }

  Object.keys(TYPE_META).forEach(t => { state.generating[t] = false; });
  render();
}

function handleSourceSubmit({ title, text }) {
  state.sourceText = text;
  state.sourceTitle = title || 'Untitled Article';

  // Create a summary from the first 200 characters
  const cleaned = text.replace(/\s+/g, ' ').trim();
  state.sourceSummary = cleaned.length > 200
    ? cleaned.substring(0, 200) + '...'
    : cleaned;

  // Clear any previous articles
  state.articles = {};
  render();
}

// ─── Initialize ─────────────────────────────────────────────
function init() {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${renderNavbar()}
    ${renderSidebar()}
    <main class="pt-24 pb-20 px-6 max-w-7xl mx-auto lg:ml-64">
      <!-- Header Section -->
      <header class="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Editorial Hub</p>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-on-surface">Article Transformation</h1>
        </div>
        <button id="btn-generate-all" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">auto_awesome</span>
          Generate All
        </button>
      </header>

      <div class="relative">
        <!-- Main Card Area -->
        <div id="main-content"></div>
        <!-- Sub Cards Area -->
        <div id="card-section" class="relative"></div>
      </div>

      <!-- Experimental Formats Bento Grid -->
      <section class="mt-32">
        <h2 class="text-2xl font-black text-on-surface mb-10 tracking-tight">Experimental Formats</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
          <div class="md:col-span-2 bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-8 rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/5">
            <div>
              <h3 class="text-xl font-bold mb-4">Interactive Node Graph</h3>
              <p class="text-on-surface-variant">Visualize how individual concepts from your paper connect to different cultural and scientific domains.</p>
            </div>
            <div class="bg-surface-container p-4 rounded-md flex items-center gap-4">
              <span class="material-symbols-outlined text-primary">hub</span>
              <span class="text-sm font-medium">Map derived from key semantic entities</span>
              <button class="ml-auto bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full">Explore</button>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col items-center text-center justify-center border border-outline-variant/5">
            <span class="material-symbols-outlined text-primary text-5xl mb-6">history_edu</span>
            <h3 class="text-lg font-bold mb-2">Historical Context</h3>
            <p class="text-sm text-on-surface-variant mb-6">Reframe the findings through the lens of history.</p>
            <button class="w-full py-3 rounded-full border border-primary text-primary font-bold text-xs hover:bg-primary/5 transition-colors">Start Conversion</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/10 px-6 py-3 flex justify-between items-center z-50">
      <button class="flex flex-col items-center gap-1 text-primary">
        <span class="material-symbols-outlined">dashboard</span>
        <span class="text-[10px] font-bold uppercase">Home</span>
      </button>
      <button class="flex flex-col items-center gap-1 text-on-surface-variant">
        <span class="material-symbols-outlined">auto_awesome</span>
        <span class="text-[10px] font-bold uppercase">Magic</span>
      </button>
      <div class="mb-6">
        <button id="btn-mobile-add" class="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/40 flex items-center justify-center">
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
      <button class="flex flex-col items-center gap-1 text-on-surface-variant">
        <span class="material-symbols-outlined">history</span>
        <span class="text-[10px] font-bold uppercase">Logs</span>
      </button>
      <button class="flex flex-col items-center gap-1 text-on-surface-variant">
        <span class="material-symbols-outlined">person</span>
        <span class="text-[10px] font-bold uppercase">Account</span>
      </button>
    </nav>

    <!-- Modals -->
    ${renderArticleModal()}
    ${renderInputModal()}
  `;

  // Mount global event listeners
  mountArticleModal();
  mountInputModal({
    onSubmit: handleSourceSubmit
  });

  document.getElementById('btn-generate-all').addEventListener('click', handleGenerateAll);

  const mobileAdd = document.getElementById('btn-mobile-add');
  if (mobileAdd) mobileAdd.addEventListener('click', () => openInputModal());

  // Initial render
  render();
}

// Boot
document.addEventListener('DOMContentLoaded', init);
