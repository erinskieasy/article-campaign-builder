const { ARTICLE_TYPES } = require('../../src/domain/models/article');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.json({ types: ARTICLE_TYPES });
};
