require('dotenv').config();

const express = require('express');
const path = require('path');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (large limit for full paper text)
app.use(express.json({ limit: '2mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/articles', articleRoutes);

// Fallback to index.html for SPA-style navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🚀 Article Campaign Builder running at http://localhost:${PORT}\n`);
});
