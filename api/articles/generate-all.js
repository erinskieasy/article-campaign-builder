const { generateAllSubArticles } = require('../../src/domain/services/generationService');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceText, customTypes } = req.body;

    if (!sourceText || !sourceText.trim()) {
      return res.status(400).json({ error: 'sourceText is required' });
    }

    const articles = await generateAllSubArticles(sourceText, customTypes || {});
    return res.json({ articles });
  } catch (err) {
    console.error('[generate-all] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
