const API_URL = 'https://club-ccn9.onrender.com';

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
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (data.success) {
      toggleEditMode();
      document.getElementById('admin-gallery-section').classList.remove('hidden');
loadAdminGallery();
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
    const response = await fetch(`${API_URL}/save`, {
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



function loadAdminGallery() {
  fetch('https://club-ccn9.onrender.com/gallery')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('admin-images');
      container.innerHTML = '';
      data.forEach((img, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = "relative inline-block";

        const imgEl = document.createElement('img');
        imgEl.src = img.url;
        imgEl.className = "h-32 rounded shadow";

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.className = "absolute top-1 right-1 bg-red-600 text-white px-2 rounded";
        delBtn.onclick = () => deleteImage(index);

        wrapper.appendChild(imgEl);
        wrapper.appendChild(delBtn);
        container.appendChild(wrapper);
      });
    });
}

function uploadImage() {
  const fileInput = document.getElementById('upload-image');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);

  fetch('https://club-ccn9.onrender.com/upload-image', {
    method: 'POST',
    body: formData
  }).then(() => {
    fileInput.value = '';
    loadAdminGallery();
  });
}

function deleteImage(index) {
  fetch('https://club-ccn9.onrender.com/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  }).then(() => loadAdminGallery());
}