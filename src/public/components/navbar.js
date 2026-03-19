/**
 * Navbar Component
 * Fixed top navigation bar with branding and action buttons.
 */
export function renderNavbar() {
  return `
    <nav class="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm shadow-blue-900/5 flex items-center justify-between px-6 py-3 max-w-full mx-auto font-sans antialiased text-slate-800 tracking-tight">
      <div class="flex items-center gap-8">
        <span class="text-xl font-bold tracking-tighter text-blue-700">The Fluid Archive</span>
        <div class="hidden md:flex items-center gap-6">
          <a class="text-slate-500 hover:text-slate-800 transition-colors" href="#">Archive</a>
          <a class="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" href="#">Transform</a>
          <a class="text-slate-500 hover:text-slate-800 transition-colors" href="#">Analytics</a>
          <a class="text-slate-500 hover:text-slate-800 transition-colors" href="#">Settings</a>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-slate-200/50 rounded-full transition-all active:scale-95 duration-200 ease-in-out">
          <span class="material-symbols-outlined text-slate-600">notifications</span>
        </button>
        <button class="p-2 hover:bg-slate-200/50 rounded-full transition-all active:scale-95 duration-200 ease-in-out">
          <span class="material-symbols-outlined text-slate-600">account_circle</span>
        </button>
      </div>
    </nav>
  `;
}
