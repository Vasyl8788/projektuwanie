// admin.js
const editableElements = document.querySelectorAll('[data-editable]');
const saveBtn = document.getElementById('saveBtn');
const adminLogin = document.getElementById('admin-login');

let editMode = false;

function toggleEditMode() {
  editMode = !editMode;
  editableElements.forEach(el => {
    el.contentEditable = editMode ? "true" : "false";
    if (editMode) el.classList.add('editable');
    else el.classList.remove('editable');
  });

  saveBtn.style.display = editMode ? 'block' : 'none';
}

adminLogin.addEventListener('click', (e) => {
  e.preventDefault();
  toggleEditMode();
});

// Збереження контенту на сервер
saveBtn.addEventListener('click', async () => {
  // Збираємо всі editable елементи у об’єкт з ключами по data-editable
  const content = {};
  editableElements.forEach(el => {
    content[el.getAttribute('data-editable')] = el.innerText.trim();
  });

  try {
    const response = await fetch('/save', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(content),
    });

    if (response.ok) {
      alert('✅ Збережено!');
      toggleEditMode(); // Вимикаємо режим редагування після збереження
    } else {
      alert('❌ Помилка при збереженні!');
    }
  } catch (err) {
    alert('❌ Помилка при збереженні!');
    console.error(err);
  }
});

// Підвантаження контенту при завантаженні сторінки
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/content');
    if (!response.ok) throw new Error('Не вдалось завантажити контент');
    const data = await response.json();

    // Заповнюємо всі editable елементи даними з файлу
    editableElements.forEach(el => {
      const key = el.getAttribute('data-editable');
      if (data[key]) {
        el.innerText = data[key];
      }
    });
  } catch (err) {
    console.warn('Could not load content:', err);
  }
});