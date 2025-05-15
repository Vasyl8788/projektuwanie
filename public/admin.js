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

adminLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  const password = prompt("Введіть пароль для доступу до редагування:");
  if (!password) return;

  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      toggleEditMode();
    } else {
      alert("❌ Невірний пароль!");
    }
  } catch (err) {
    alert("❌ Помилка авторизації!");
    console.error(err);
  }
});

// Збереження контенту на сервер
saveBtn.addEventListener('click', async () => {
  const content = {};
  editableElements.forEach(el => {
    content[el.getAttribute('data-editable')] = el.innerText.trim();
  });

  try {
    const response = await fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });

    if (response.ok) {
      alert('✅ Збережено!');
      toggleEditMode();
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