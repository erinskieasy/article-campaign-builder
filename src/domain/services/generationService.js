const OpenAI = require('openai');
const { ARTICLE_TYPES, createArticle } = require('../models/article');

let openai = null;

function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

/**
 * Generate a single sub-article from source text.
 * @param {string} sourceText - The original paper/article text.
 * @param {string} articleType - One of the ARTICLE_TYPES keys.
 * @param {string} [customPrompt] - Optional custom system prompt override.
 * @returns {Promise<object>} Generated article object.
 */
async function generateSubArticle(sourceText, articleType, customPrompt) {
  const typeDef = ARTICLE_TYPES[articleType];
  const systemPrompt = customPrompt || (typeDef && typeDef.systemPrompt);

  if (!systemPrompt) {
    throw new Error(`Unknown article type and no custom prompt provided: ${articleType}`);
  }

  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sourceText }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  const content = response.choices[0]?.message?.content || '';

  // Extract a title from the first markdown heading, or use the type title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : (typeDef ? typeDef.title : articleType);

  return createArticle({ type: articleType, title, content });
}

/**
 * Generate all sub-article types in parallel.
 * @param {string} sourceText - The original paper/article text.
 * @param {object} [customTypes] - Optional map of type → { systemPrompt } for custom cards.
 * @returns {Promise<object>} Map of articleType → generated article.
 */
async function generateAllSubArticles(sourceText, customTypes = {}) {
  // Merge built-in types with any custom types
  const allTypes = { ...ARTICLE_TYPES, ...customTypes };
  const types = Object.keys(allTypes);

  const results = await Promise.allSettled(
    types.map(type => {
      const prompt = allTypes[type].systemPrompt;
      return generateSubArticle(sourceText, type, prompt);
    })
  );

  const articles = {};
  results.forEach((result, i) => {
    const type = types[i];
    if (result.status === 'fulfilled') {
      articles[type] = result.value;
    } else {
      articles[type] = {
        type,
        error: result.reason?.message || 'Generation failed',
        meta: ARTICLE_TYPES[type] || allTypes[type] || null
      };
    }
  });

  return articles;
}

module.exports = { generateSubArticle, generateAllSubArticles };
