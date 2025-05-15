let isAdmin = false;

document.getElementById('admin-login').addEventListener('click', () => {
  const pass = prompt("Wprowadź hasło:");
  if (pass === 'Kamil3333') {
    isAdmin = true;
    enableEditing();
  }
});

function enableEditing() {
  document.querySelectorAll('[data-editable]').forEach(el => {
    el.contentEditable = true;
    el.style.border = '1px dashed red';
    el.addEventListener('input', saveChanges);
  });
}

async function saveChanges() {
  const data = {};
  document.querySelectorAll('[data-editable]').forEach(el => {
    data[el.dataset.editable] = el.innerText;
  });
  await fetch('/save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/content');
  const data = await res.json();
  Object.entries(data).forEach(([key, value]) => {
    const el = document.querySelector(`[data-editable="${key}"]`);
    if (el) el.innerText = value;
  });
});