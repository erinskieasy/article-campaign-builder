const { generateSubArticle, generateAllSubArticles } = require('../../domain/services/generationService');
const { ARTICLE_TYPES } = require('../../domain/models/article');

/**
 * POST /api/articles/generate
 * Generate a single sub-article by type.
 */
async function generateOne(req, res) {
  try {
    const { sourceText, type } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }
    if (!type || !ARTICLE_TYPES[type]) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${Object.keys(ARTICLE_TYPES).join(', ')}`
      });
    }

    const article = await generateSubArticle(sourceText, type);
    return res.json({ article });
  } catch (err) {
    console.error('[generateOne] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/articles/generate-all
 * Generate all sub-article types from source text.
 */
async function generateAll(req, res) {
  try {
    const { sourceText } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }

    const articles = await generateAllSubArticles(sourceText);
    return res.json({ articles });
  } catch (err) {
    console.error('[generateAll] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/articles/types
 * Return the available article type definitions.
 */
function getTypes(req, res) {
  return res.json({ types: ARTICLE_TYPES });
}

module.exports = { generateOne, generateAll, getTypes };
