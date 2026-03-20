const { generateSubArticle } = require('../../src/domain/services/generationService');
const { ARTICLE_TYPES } = require('../../src/domain/models/article');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceText, type, customPrompt } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'type is required' });
    }
    if (!ARTICLE_TYPES[type] && !customPrompt) {
      return res.status(400).json({
        error: `Unknown type "${type}" — provide a customPrompt for custom card types.`
      });
    }

    const article = await generateSubArticle(sourceText, type, customPrompt);
    return res.json({ article });
  } catch (err) {
    console.error('[generate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
