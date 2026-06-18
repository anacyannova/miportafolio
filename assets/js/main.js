// =====================
// TOGGLE TEMA CLARO/OSCURO
// =====================

const themeToggle = document.getElementById('themeToggle');

// Al cargar, revisar si el usuario tenía preferencia guardada
if (localStorage.getItem('tema') === 'light') {
    document.documentElement.classList.add('light');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const tema = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('tema', tema);
});

// =====================
// MENÚ HAMBURGUESA
// =====================

const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

// Cerrar menú al hacer clic en un link (en mobile)
sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
    });
});