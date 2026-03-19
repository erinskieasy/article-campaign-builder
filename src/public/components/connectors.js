/**
 * Connectors Component
 * SVG bezier curves connecting the main card to sub-cards.
 */
export function renderConnectors() {
  return `
    <div class="absolute inset-0 pointer-events-none z-0 hidden lg:block" id="connectors-container">
      <svg class="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <path class="node-connector" d="M600 240 C 600 320, 150 320, 150 400"></path>
        <path class="node-connector" d="M600 240 C 600 320, 450 320, 450 400"></path>
        <path class="node-connector" d="M600 240 C 600 320, 750 320, 750 400"></path>
        <path class="node-connector" d="M600 240 C 600 320, 1050 320, 1050 400"></path>
      </svg>
    </div>
  `;
}
