import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Повертає контент з content.json
app.get('/content', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'content.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading content:', err);
      return res.status(500).send('Error reading content');
    }
    try {
      res.json(JSON.parse(data));
    } catch {
      res.json({});
    }
  });
});

// Зберігає контент у content.json
app.post('/save', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'content.json');
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Save failed:', err);
      return res.status(500).send('Save failed');
    }
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));