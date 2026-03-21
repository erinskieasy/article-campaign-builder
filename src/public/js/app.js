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
import { renderSettingsModal, openSettingsModal, mountSettingsModal } from '../components/settingsModal.js';
import { renderNewCardModal, openNewCardModal, mountNewCardModal } from '../components/newCardModal.js';
import { renderHelpModal, openHelpModal, mountHelpModal } from '../components/helpModal.js';
import { renderConnectors, updateConnectors } from '../components/connectors.js';

// ─── Notification Pipeline ─────────────────────────────────
import { pushNotification } from '../components/notifications/notificationService.js';
import { renderNotificationBell, mountNotificationBell } from '../components/notifications/notificationBell.js';
import { renderNotificationPanel, mountNotificationPanel, togglePanel } from '../components/notifications/notificationPanel.js';

// ─── Default system prompts (must match backend article.js) ────
const DEFAULT_PROMPTS = {
  'non-technical': `You are a skilled science communicator who makes complex topics accessible to everyone.\nRewrite the following research paper as a friendly, engaging article for a general audience.\nUse everyday analogies, avoid jargon, and keep the tone warm and inviting.\nAim for 600-900 words. Use short paragraphs and clear subheadings.\nReturn the article in Markdown format.`,
  'commentary': `You are an opinionated technology commentator writing for a popular blog.\nWrite a thought-provoking commentary piece based on the following paper.\nInclude your critical perspective on ethical implications, industry shifts, and what this means for society.\nBe bold with your opinions but back them up with reasoning.\nAim for 700-1000 words in Markdown format with a compelling headline.`,
  'ai-focused': `You are an AI/ML researcher writing for a technical-but-accessible audience.\nReframe the following paper through the lens of artificial intelligence and machine learning.\nHighlight connections to AI, potential ML applications, synergies with neural networks, and implications for the AI industry.\nAim for 700-1000 words in Markdown format.`,
  'trending-news': `You are a senior journalist at a major international news wire service.\nWrite a crisp, authoritative news article based on the following paper.\nFocus on global impact, international competition, policy implications, and what world leaders should know.\nUse the inverted pyramid structure. Be factual and punchy.\nAim for 500-700 words in Markdown format with a strong headline.`
};

// ─── Application State ─────────────────────────────────────
const state = {
  sourceText: '',
  sourceTitle: '',
  sourceSummary: '',
  articles: {},        // { 'non-technical': { content, title, ... }, ... }
  generating: {},      // { 'non-technical': true/false, ... }
  customPrompts: {},   // { 'non-technical': 'overridden prompt', ... }
  customTypes: {},     // { 'custom-id': { icon, title, desc, systemPrompt }, ... }
};

const TYPE_META = {
  'non-technical': { icon: 'lightbulb', title: 'Non-Technical Article' },
  'commentary': { icon: 'chat_bubble', title: 'Commentary Blog Post' },
  'ai-focused': { icon: 'memory', title: 'AI-Focused Slant' },
  'trending-news': { icon: 'public', title: 'Trending Global News' }
};

// ─── Helpers ────────────────────────────────────────────────
function getPromptForType(type) {
  if (state.customPrompts[type]) return state.customPrompts[type];
  if (state.customTypes[type]) return state.customTypes[type].systemPrompt;
  return DEFAULT_PROMPTS[type] || '';
}

function getMetaForType(type) {
  if (state.customTypes[type]) {
    return { icon: state.customTypes[type].icon, title: state.customTypes[type].title };
  }
  return TYPE_META[type] || { icon: 'article', title: type };
}

function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── API Client ─────────────────────────────────────────────
async function apiGenerateOne(sourceText, type, customPrompt) {
  const body = { sourceText, type };
  if (customPrompt) body.customPrompt = customPrompt;

  const res = await fetch('/api/articles/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Generation failed');
  }
  return res.json();
}

async function apiGenerateAll(sourceText, customTypes) {
  const body = { sourceText };
  if (Object.keys(customTypes).length > 0) body.customTypes = customTypes;

  const res = await fetch('/api/articles/generate-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
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
        openArticleModal(article, getMetaForType(type));
      }
    },
    onGenerate: (type) => handleGenerate(type),
    onDownload: (type) => handleDownloadOne(type),
    onSettings: (type) => {
      const prompt = getPromptForType(type);
      const meta = getMetaForType(type);
      openSettingsModal(type, prompt, meta);
    },
    onAddCard: () => openNewCardModal(),
    onDeleteCard: (type) => handleDeleteCard(type)
  });

  // Re-calculate dynamic connectors after rendering
  setTimeout(updateConnectors, 50); // Small delay to ensure DOM is ready
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
    const prompt = getPromptForType(type);
    const result = await apiGenerateOne(state.sourceText, type, prompt);
    state.articles[type] = result.article;

    const meta = getMetaForType(type);
    pushNotification({
      title: `${meta.title} Ready`,
      message: `"${result.article.title || meta.title}" has been generated successfully.`,
      icon: meta.icon || 'check_circle',
      type: 'success'
    });
  } catch (err) {
    state.articles[type] = { error: err.message, type };
    console.error(`[Generate ${type}] Error:`, err.message);

    const meta = getMetaForType(type);
    pushNotification({
      title: `${meta.title} Failed`,
      message: err.message,
      icon: 'error',
      type: 'error'
    });
  }

  state.generating[type] = false;
  render();
}

async function handleGenerateAll() {
  if (!state.sourceText) {
    openInputModal();
    return;
  }

  // Mark all types (built-in + custom) as generating
  const allTypeKeys = [...Object.keys(TYPE_META), ...Object.keys(state.customTypes)];
  allTypeKeys.forEach(t => { state.generating[t] = true; });
  render();

  try {
    // Build custom types map with any prompt overrides
    const customTypesForApi = {};
    // Include prompt overrides for built-in types
    Object.keys(DEFAULT_PROMPTS).forEach(t => {
      if (state.customPrompts[t]) {
        customTypesForApi[t] = { systemPrompt: state.customPrompts[t] };
      }
    });
    // Include user-created custom cards
    Object.entries(state.customTypes).forEach(([key, val]) => {
      customTypesForApi[key] = { systemPrompt: val.systemPrompt };
    });

    const result = await apiGenerateAll(state.sourceText, customTypesForApi);
    let successCount = 0;
    let errorCount = 0;
    Object.entries(result.articles).forEach(([type, article]) => {
      state.articles[type] = article;
      if (article.error) errorCount++;
      else successCount++;
    });

    pushNotification({
      title: 'Batch Generation Complete',
      message: `${successCount} article${successCount !== 1 ? 's' : ''} generated${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
      icon: errorCount > 0 ? 'warning' : 'auto_awesome',
      type: errorCount > 0 ? 'info' : 'success'
    });
  } catch (err) {
    console.error('[GenerateAll] Error:', err.message);
    pushNotification({
      title: 'Batch Generation Failed',
      message: err.message,
      icon: 'error',
      type: 'error'
    });
  }

  allTypeKeys.forEach(t => { state.generating[t] = false; });
  render();
}

function handleDownloadOne(type) {
  const article = state.articles[type];
  if (!article || !article.content) return;

  const meta = getMetaForType(type);
  const filename = `${meta.title.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}.md`;
  downloadMarkdown(filename, article.content);
}

function handleDownloadAll() {
  const allTypes = { ...TYPE_META, ...state.customTypes };
  Object.keys(allTypes).forEach(type => {
    const article = state.articles[type];
    if (article && article.content) {
      const meta = getMetaForType(type);
      const filename = `${meta.title.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}.md`;
      downloadMarkdown(filename, article.content);
    }
  });
}

function handleDeleteCard(type) {
  delete state.customTypes[type];
  delete state.articles[type];
  delete state.generating[type];
  delete state.customPrompts[type];
  render();
}

function handleSourceSubmit({ title, text }) {
  state.sourceText = text;
  state.sourceTitle = title || 'Untitled Article';

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
        <div class="flex items-center gap-3">
          <button id="btn-download-all" class="bg-surface-container-lowest text-on-surface-variant px-6 py-4 rounded-full font-bold border border-outline-variant/20 hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">download</span>
            Download All
          </button>
          <button id="btn-generate-all" class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">auto_awesome</span>
            Generate All
          </button>
        </div>
      </header>

      <div class="relative">
        <!-- Main Card Area -->
        <div id="main-content"></div>
        <!-- Sub Cards Area -->
        <div id="card-section" class="relative"></div>
      </div>

      <!-- Experimental Formats Bento Grid -->
      <!-- let  get rid of  this section because it  doesnt work -->
      <!-- 
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
      -->
    </main>

    <!-- Mobile Bottom Navigation -->
    <!-- let  get rid of  this section because it  doesnt work -->
    <!-- 
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
    -->

    <!-- Modals -->
    ${renderArticleModal()}
    ${renderInputModal()}
    ${renderSettingsModal()}
    ${renderNewCardModal()}
    ${renderNotificationPanel()}
    <div id="help-modal-container">
      ${renderHelpModal()}
    </div>
  `;

  // Mount global event listeners
  mountArticleModal();
  mountInputModal({
    onSubmit: handleSourceSubmit
  });
  mountSettingsModal({
    onApply: (type, newPrompt) => {
      if (state.customTypes[type]) {
        state.customTypes[type].systemPrompt = newPrompt;
      } else {
        state.customPrompts[type] = newPrompt;
      }
    },
    onReset: (type) => {
      if (state.customTypes[type]) return;
      delete state.customPrompts[type];
    }
  });
  mountNewCardModal({
    onCreate: ({ name, icon, instructions }) => {
      const id = 'custom-' + name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase() + '-' + Date.now();
      state.customTypes[id] = {
        icon,
        title: name,
        desc: instructions.length > 100 ? instructions.substring(0, 100) + '...' : instructions,
        systemPrompt: instructions
      };
      render();
    }
  });

  // ─── Notification Pipeline ────────────────────────────────
  // Inject bell + panel into navbar actions slot
  const navbarActions = document.getElementById('navbar-actions');
  if (navbarActions) {
    navbarActions.insertAdjacentHTML('afterbegin', renderNotificationBell());
  }
  mountNotificationBell((isOpen) => togglePanel(isOpen));
  mountNotificationPanel();

  const btnHelp = document.getElementById('btn-sidebar-help');
  if (btnHelp) btnHelp.addEventListener('click', (e) => {
    e.preventDefault();
    openHelpModal();
  });

  document.getElementById('btn-generate-all').addEventListener('click', handleGenerateAll);
  document.getElementById('btn-download-all').addEventListener('click', handleDownloadAll);

  window.addEventListener('resize', updateConnectors);

  const mobileAdd = document.getElementById('btn-mobile-add');
  if (mobileAdd) mobileAdd.addEventListener('click', () => openInputModal());

  // Initial render
  render();
}

// Boot
document.addEventListener('DOMContentLoaded', init);
