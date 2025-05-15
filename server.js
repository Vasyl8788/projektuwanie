import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/content', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'content.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading content');
    res.send(JSON.parse(data));
  });
});

app.post('/save', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'content.json');
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).send('Save failed');
    res.send({ success: true });
  });
});

app.listen(3000, () => console.log('Сервер запущено на http://localhost:3000'));