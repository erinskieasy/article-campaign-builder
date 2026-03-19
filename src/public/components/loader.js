/**
 * Loader Component
 * Skeleton loading placeholders for content areas.
 */
export function renderSkeletonCard() {
  return `
    <div class="bg-surface-container-low rounded-md p-6">
      <div class="skeleton w-12 h-12 rounded-full mb-6"></div>
      <div class="skeleton skeleton-line w-3/4"></div>
      <div class="skeleton skeleton-line w-full"></div>
      <div class="skeleton skeleton-line w-5/6"></div>
      <div class="skeleton skeleton-line w-1/2 mt-6"></div>
    </div>
  `;
}

export function renderSpinner(size = 'md') {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return `<span class="spinner ${sizeClass}"></span>`;
}
