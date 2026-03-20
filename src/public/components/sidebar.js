/**
 * Sidebar Component
 * Desktop side navigation panel (hidden on mobile).
 */
export function renderSidebar() {
  return `
    <aside class="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-slate-900 p-4 space-y-2 z-[60] border-r border-slate-800">
      <div class="mb-8 px-4 py-2">
        <h4 class="text-lg font-black text-white">The Atheneum</h4>
        <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Editorial Mode</p>
      </div>
      <nav class="flex-1 space-y-1">
        <a class="flex items-center gap-3 p-3 bg-blue-500/10 text-blue-400 rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="text-sm font-medium">Dashboard</span>
        </a>
        <!-- comment out all these other buttons-->
        <!--
        <a class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">auto_awesome</span>
          <span class="text-sm font-medium">Templates</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">description</span>
          <span class="text-sm font-medium">Drafts</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">history</span>
          <span class="text-sm font-medium">History</span>
        </a>
        <a class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">group</span>
          <span class="text-sm font-medium">Community</span>
        </a>
        -->
      </nav>
      <div class="pt-6 border-t border-slate-800 space-y-1">
        <a id="btn-sidebar-help" class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all cursor-pointer" href="#">
          <span class="material-symbols-outlined">help</span>
          <span class="text-sm font-medium">Help</span>
        </a>
        <!-- we dont have auth yet so let remove logout button for now
        <a class="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all" href="#">
          <span class="material-symbols-outlined">logout</span>
          <span class="text-sm font-medium">Logout</span>
        </a>
        -->
      </div>
    </aside>
  `;
}
