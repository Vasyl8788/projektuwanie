const API_URL = 'https://projektuwanie.onrender.com';

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
  const password = prompt("Wprowadź hasło, aby uzyskać dostęp do edycji:");
  if (!password) return;

  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (data.success) {
      toggleEditMode();
    } else {
      alert("❌ Nieprawidłowe hasło!");
    }
  } catch (err) {
    alert("❌ Błąd autoryzacji!");
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
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });

    if (response.ok) {
      alert('✅ Zachowane!');
      toggleEditMode();
    } else {
      alert('❌ Błąd podczas zapisywania!');
    }
  } catch (err) {
    alert('❌ Błąd podczas zapisywania!');
    console.error(err);
  }
});

// Ładowanie treści podczas ładowania strony
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${API_URL}/content`);
    if (!response.ok) throw new Error('Nie udało się pobrać treści');
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

function showAdminInfo() {
  const modal = document.getElementById("adminInfoModal");
  modal.classList.remove("hidden");
}

function hideAdminInfo() {
  const modal = document.getElementById("adminInfoModal");
  modal.classList.add("hidden");
}

document.getElementById("closeAdminInfo").addEventListener("click", hideAdminInfo);

// Якщо потрібно одразу після входу:
function enterAdminMode() {
  isAdmin = true;
  showAdminInfo();

}



  