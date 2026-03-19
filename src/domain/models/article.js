/**
 * Article Types — each defines a derivative article format
 * with its own icon, description, and generation prompt.
 */
const ARTICLE_TYPES = {
  'non-technical': {
    id: 'non-technical',
    title: 'Non-Technical Article',
    icon: 'lightbulb',
    description: 'Breaking down complex ideas into everyday analogies for a general audience.',
    systemPrompt: `You are a skilled science communicator who makes complex topics accessible to everyone.
Rewrite the following research paper as a friendly, engaging article for a general audience.
Use everyday analogies, avoid jargon, and keep the tone warm and inviting.
Aim for 600-900 words. Use short paragraphs and clear subheadings.
Return the article in Markdown format.`
  },

  'commentary': {
    id: 'commentary',
    title: 'Commentary Blog Post',
    icon: 'chat_bubble',
    description: 'A critical take on the societal implications and industry shifts.',
    systemPrompt: `You are an opinionated technology commentator writing for a popular blog.
Write a thought-provoking commentary piece based on the following paper.
Include your critical perspective on ethical implications, industry shifts, and what this means for society.
Be bold with your opinions but back them up with reasoning.
Aim for 700-1000 words in Markdown format with a compelling headline.`
  },

  'ai-focused': {
    id: 'ai-focused',
    title: 'AI-Focused Slant',
    icon: 'memory',
    description: 'Exploring the intersection with artificial intelligence and machine learning.',
    systemPrompt: `You are an AI/ML researcher writing for a technical-but-accessible audience.
Reframe the following paper through the lens of artificial intelligence and machine learning.
Highlight connections to AI, potential ML applications, synergies with neural networks, and implications for the AI industry.
Aim for 700-1000 words in Markdown format.`
  },

  'trending-news': {
    id: 'trending-news',
    title: 'Trending Global News',
    icon: 'public',
    description: 'Concise, impactful reporting on the international implications.',
    systemPrompt: `You are a senior journalist at a major international news wire service.
Write a crisp, authoritative news article based on the following paper.
Focus on global impact, international competition, policy implications, and what world leaders should know.
Use the inverted pyramid structure. Be factual and punchy.
Aim for 500-700 words in Markdown format with a strong headline.`
  }
};

/**
 * Factory function to create an article object.
 */
function createArticle({ type, title, content, sourceId = null }) {
  return {
    id: `${type}-${Date.now()}`,
    type,
    title,
    content,
    sourceId,
    createdAt: new Date().toISOString(),
    meta: ARTICLE_TYPES[type] || null
  };
}

module.exports = { ARTICLE_TYPES, createArticle };
