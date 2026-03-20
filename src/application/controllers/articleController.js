const { generateSubArticle, generateAllSubArticles } = require('../../domain/services/generationService');
const { ARTICLE_TYPES } = require('../../domain/models/article');

/**
 * POST /api/articles/generate
 * Generate a single sub-article by type.
 * Accepts optional `customPrompt` to override the default system prompt.
 */
async function generateOne(req, res) {
  try {
    const { sourceText, type, customPrompt } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'type is required' });
    }
    // Allow unknown types if a customPrompt is provided
    if (!ARTICLE_TYPES[type] && !customPrompt) {
      return res.status(400).json({
        error: `Unknown type "${type}" — provide a customPrompt for custom card types.`
      });
    }

    const article = await generateSubArticle(sourceText, type, customPrompt);
    return res.json({ article });
  } catch (err) {
    console.error('[generateOne] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/articles/generate-all
 * Generate all sub-article types from source text.
 * Accepts optional `customTypes` map for custom cards.
 */
async function generateAll(req, res) {
  try {
    const { sourceText, customTypes } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }

    const articles = await generateAllSubArticles(sourceText, customTypes || {});
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

