import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.ADMIN_PASSWORD;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Дозволити CORS — потрібно, якщо фронт і бек окремо
app.use(express.json());
app.use(express.static('public'));

app.post('/auth', (req, res) => {
  const { password } = req.body;
  console.log("👉 Введено пароль:", password);
  console.log("🔐 Пароль із .env:", PASSWORD);

  if (password === PASSWORD) {
    console.log("✅ Авторизація успішна");
    return res.status(200).json({ success: true });
  }
  console.log("❌ Невірний пароль");
  return res.status(401).json({ success: false, message: 'Invalid password' });
});

app.get('/content', (req, res) => {
  const contentPath = path.join(__dirname, 'content.json');
  if (!fs.existsSync(contentPath)) {
    return res.json({});
  }
  const content = fs.readFileSync(contentPath, 'utf-8');
  res.json(JSON.parse(content));
});

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