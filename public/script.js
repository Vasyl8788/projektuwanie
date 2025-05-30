// --- Прокрутка догори при кліку по заголовку ---
document.getElementById("top-heading").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Мобільне меню ---
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const name = document.getElementById('name');

navToggle.addEventListener("click", () => {
  navList.classList.toggle("show");
  name.classList.toggle("show");
  navToggle.classList.toggle("active");
});




  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
