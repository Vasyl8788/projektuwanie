document.getElementById("top-heading").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const name = document.getElementById('name');

navToggle.addEventListener("click", () => {
  navList.classList.toggle("show");
  name.classList.toggle("show");
  navToggle.classList.toggle("active");
});


document.getElementById('saveBtn').addEventListener('click', async () => {
  const password = localStorage.getItem('adminPassword'); // або введи з input

  if (!password) {
    alert("❗ Спочатку увійди як адмін");
    return;
  }

  const newContent = {
    title: document.querySelector('#mainTitle').innerText,
    description: document.querySelector('#mainDescription').innerText,
    navigation: Array.from(document.querySelectorAll('.nav-item')).map(el => el.innerText)
  };

  const response = await fetch('/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': password
    },
    body: JSON.stringify(newContent),
  });

  if (response.ok) {
    alert('✅ Збережено!');
  } else {
    alert('❌ Помилка при збереженні!');
  }
});