// Прокрутка до верху при кліку на заголовок
document.getElementById("top-heading").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Меню-бургер
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const name = document.getElementById('name');

navToggle.addEventListener("click", () => {
  navList.classList.toggle("show");
  name.classList.toggle("show");
  navToggle.classList.toggle("active");
});

// Завантаження контенту на сторінку при старті
const API_URL = 'https://club-ccn9.onrender.com';
const editableElements = document.querySelectorAll('[data-editable]');

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${API_URL}/content`);
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