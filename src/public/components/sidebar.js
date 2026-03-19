/**
 * Sidebar Component
 * Desktop side navigation panel (hidden on mobile).
 */
export function renderSidebar() {
  return `
    <aside class="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-slate-50 p-4 space-y-2 z-[60] border-r border-slate-200">
      <div class="mb-8 px-4 py-2">
        <h4 class="text-lg font-black text-slate-900">The Atheneum</h4>
        <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Editorial Mode</p>
      </div>
      <nav class="flex-1 space-y-1">
        <a class="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="text-sm font-medium">Dashboard</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">auto_awesome</span>
          <span class="text-sm font-medium">Templates</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">description</span>
          <span class="text-sm font-medium">Drafts</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">history</span>
          <span class="text-sm font-medium">History</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">group</span>
          <span class="text-sm font-medium">Community</span>
        </a>
      </nav>
      <div class="pt-6 border-t border-slate-100 space-y-1">
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">help</span>
          <span class="text-sm font-medium">Help</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">logout</span>
          <span class="text-sm font-medium">Logout</span>
        </a>
      </div>
    </aside>
  `;
}
