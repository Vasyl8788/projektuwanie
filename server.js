const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const PASSWORD = process.env.ADMIN_PASSWORD;

app.use(express.json());
app.use(express.static('public'));

// Авторизація
app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    return res.status(200).json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid password' });
});

// Отримання контенту
app.get('/content', (req, res) => {
  const contentPath = path.join(__dirname, 'content.json');
  if (!fs.existsSync(contentPath)) {
    return res.json({});
  }
  const content = fs.readFileSync(contentPath, 'utf-8');
  res.json(JSON.parse(content));
});

// Збереження контенту
app.post('/save', (req, res) => {
  const contentPath = path.join(__dirname, 'content.json');
  fs.writeFile(contentPath, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.error('❌ Помилка збереження:', err);
      return res.status(500).json({ message: 'Saving failed' });
    }
    res.status(200).json({ message: 'Saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});