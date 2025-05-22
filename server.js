import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.ADMIN_PASSWORD;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.join(__dirname, 'uploads') });
const galleryPath = path.join(__dirname, 'gallery.json');
const contentPath = path.join(__dirname, 'content.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 🖼 фото доступні

// 🔐 Перевірка пароля
function isAuthorized(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password === PASSWORD) return next();
  return res.status(401).json({ error: 'Not authorized' });
}

// 🔐 Авторизація
app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) return res.status(200).json({ success: true });
  return res.status(401).json({ success: false, message: 'Invalid password' });
});

// 🔄 Завантажити контент
app.get('/content', (req, res) => {
  if (!fs.existsSync(contentPath)) return res.json({});
  const content = fs.readFileSync(contentPath, 'utf-8');
  res.json(JSON.parse(content));
});

// 💾 Зберегти контент (тільки адмін)
app.post('/save', isAuthorized, (req, res) => {
  fs.writeFile(contentPath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ message: 'Saving failed' });
    res.status(200).json({ message: 'Saved successfully' });
  });
});

// 📸 Отримати зображення
app.get('/gallery', (req, res) => {
  if (!fs.existsSync(galleryPath)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
  res.json(data);
});

// 📤 Завантажити зображення (тільки адмін)
app.post('/upload-image', isAuthorized, upload.single('image'), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  let images = [];

  if (fs.existsSync(galleryPath)) {
    images = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
  }

  images.push({ url: fileUrl });
  fs.writeFileSync(galleryPath, JSON.stringify(images, null, 2));
  res.status(200).json({ success: true });
});

// ❌ Видалити зображення (тільки адмін)
app.post('/delete-image', isAuthorized, (req, res) => {
  const { index } = req.body;
  if (!fs.existsSync(galleryPath)) return res.status(404).json({ error: 'Gallery not found' });

  const images = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
  const removed = images.splice(index, 1);

  if (removed.length) {
    const filePath = path.join(__dirname, removed[0].url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // 🧹 видаляємо файл
  }

  fs.writeFileSync(galleryPath, JSON.stringify(images, null, 2));
  res.json({ success: true });
});

// ▶️ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});