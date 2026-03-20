/**
 * Connectors Component
 * Dynamic SVG bezier curves connecting the main card to sub-cards.
 * Instead of static coordinates, it calculates positions at runtime.
 */

export function renderConnectors() {
  // Return an empty SVG container that we'll fill dynamically
  return `
    <div class="absolute inset-0 pointer-events-none z-0 hidden lg:block" id="connectors-wrapper" style="min-height: 800px;">
      <svg id="dynamic-connectors-svg" class="w-full h-full" style="overflow: visible;">
        <!-- Paths will be injected here by updateConnectors() -->
      </svg>
    </div>
  `;
}

/**
 * Update the SVG paths based on the actual positions of cards.
 */
export function updateConnectors() {
  const svg = document.getElementById('dynamic-connectors-svg');
  const wrapper = document.getElementById('connectors-wrapper');
  if (!svg || !wrapper) return;

  // Clear existing paths
  svg.innerHTML = '';

  const mainCard = document.querySelector('#main-content > div > div'); // The actual card element
  const subCards = document.querySelectorAll('.sub-card');

  if (!mainCard || subCards.length === 0) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const mainRect = mainCard.getBoundingClientRect();

  // Start point: bottom-center of main card
  const startX = (mainRect.left + mainRect.width / 2) - wrapperRect.left;
  const startY = (mainRect.bottom) - wrapperRect.top;

  subCards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    
    // End point: top-center of sub card
    const endX = (cardRect.left + cardRect.width / 2) - wrapperRect.left;
    const endY = (cardRect.top) - wrapperRect.top;

    // Create a bezier curve
    // control point 1: same X as start, halfway down to end
    // control point 2: same X as end, halfway up to start
    const cp1Y = startY + (endY - startY) * 0.5;
    const cp2Y = startY + (endY - startY) * 0.5;

    const pathD = `M ${startX} ${startY} C ${startX} ${cp1Y}, ${endX} ${cp2Y}, ${endX} ${endY}`;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('class', 'node-connector');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#005bc1'); // Use primary color
    path.setAttribute('stroke-width', '2');
    path.setAttribute('style', 'opacity: 0.2; transition: d 0.3s ease;');
    
    svg.appendChild(path);
  });
}
