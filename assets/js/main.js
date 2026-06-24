// *** toggle para tema dark o light *** //

const themeToggle = document.getElementById('themeToggle');

if (localStorage.getItem('tema') === 'light') {
    document.documentElement.classList.add('light');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const tema = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('tema', tema);
});

// *** menu borgir *** //

const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
});


sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
    });
});

// *** carousel pag  single-proyecto ***//

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('proyectoCarousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const progressBar = document.getElementById('carouselProgressBar');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const total = slides.length;
    const intervalMs = 3000;
    
    let current = 0;
    let timeoutId = null;
    let isPaused = false;
    

    function goToSlide(index) {
        current = index;
        track.style.transition = 'transform 0.6s ease-in-out';
        track.style.transform = `translateX(-${current * (100 / total)}%)`;
        restartProgress();
        scheduleNext();
    }
    
    function nextSlide() {
        goToSlide((current + 1) % total);
    }
    
    function prevSlide() {
        goToSlide((current - 1 + total) % total);
    }
    
    function restartProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        void progressBar.offsetWidth;
        if (isPaused) return;
        progressBar.style.transition = `width ${intervalMs}ms linear`;
        progressBar.style.width = '100%';
    }
    
    function scheduleNext() {
        clearTimeout(timeoutId);
        if (isPaused) return;
        timeoutId = setTimeout(nextSlide, intervalMs);
    }
    
    function pause() {
        isPaused = true;
        clearTimeout(timeoutId);
        if (progressBar) {

            const currentWidth = getComputedStyle(progressBar).width;
            progressBar.style.transition = 'none';
            progressBar.style.width = currentWidth;
        }
    }
    
    function resume() {
        if (!isPaused) return;
        isPaused = false;
        restartProgress();
        scheduleNext();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('focusin', pause);
    carousel.addEventListener('focusout', resume);
    if (prevBtn) {
        prevBtn.addEventListener('mouseenter', pause);
        prevBtn.addEventListener('mouseleave', resume);
    }
    if (nextBtn) {
        nextBtn.addEventListener('mouseenter', pause);
        nextBtn.addEventListener('mouseleave', resume);
    }
    
    restartProgress();
    scheduleNext();
});

// *** acordeón pag servicios ***//

document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.getElementById('serviciosAccordion');
    if (!accordion) return;

    const triggers = accordion.querySelectorAll('.servicios-accordion-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.servicios-accordion-item');
            const panel = item.querySelector('.servicios-accordion-panel');
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            triggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    const otherPanel = otherTrigger.closest('.servicios-accordion-item').querySelector('.servicios-accordion-panel');
                    otherPanel.style.maxHeight = null;
                }
            });

            if (isOpen) {
                trigger.setAttribute('aria-expanded', 'false');
                panel.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
});

// *** filtro de tags + paginación pag bitácora ***//

// pensado para migrar a WordPress: cada tarjeta = un post, cada tag = una

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('bitacoraGrid');
    const filtros = document.getElementById('bitacoraFiltros');
    if (!grid || !filtros) return;

    const ITEMS_POR_PAGINA = 6;

    const cards = Array.from(grid.querySelectorAll('.bitacora-card'));
    const tagButtons = Array.from(filtros.querySelectorAll('.filtro-tag'));
    const todosBtn = filtros.querySelector('.filtro-tag[data-filtro="todos"]');

    const pagDots = document.getElementById('pagDots');
    const pagPrev = document.getElementById('pagPrev');
    const pagNext = document.getElementById('pagNext');

    let tagsActivos = new Set();
    let paginaActual = 1;

    function cardCoincide(card) {
        if (tagsActivos.size === 0) return true;
        const tagsCard = (card.dataset.tags || '').split(' ');
        return tagsCard.some(tag => tagsActivos.has(tag));
    }

    function actualizarBotonesTag() {
        if (tagsActivos.size === 0) {
            todosBtn.classList.add('is-active');
        } else {
            todosBtn.classList.remove('is-active');
        }
        tagButtons.forEach(btn => {
            const filtro = btn.dataset.filtro;
            if (filtro === 'todos') return;
            btn.classList.toggle('is-active', tagsActivos.has(filtro));
        });
    }

    function render() {
        const visibles = cards.filter(cardCoincide);
        const totalPaginas = Math.max(1, Math.ceil(visibles.length / ITEMS_POR_PAGINA));

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const fin = inicio + ITEMS_POR_PAGINA;

        cards.forEach(card => card.classList.add('is-hidden'));
        visibles.slice(inicio, fin).forEach(card => card.classList.remove('is-hidden'));

        renderDots(totalPaginas);
        pagPrev.disabled = paginaActual === 1;
        pagNext.disabled = paginaActual === totalPaginas;
    }

    function renderDots(totalPaginas) {
        pagDots.innerHTML = '';
        for (let i = 1; i <= totalPaginas; i++) {
            const dot = document.createElement('button');
            dot.className = 'pag-dot' + (i === paginaActual ? ' is-active' : '');
            dot.setAttribute('aria-label', `Página ${i}`);
            dot.addEventListener('click', () => {
                paginaActual = i;
                render();
            });
            pagDots.appendChild(dot);
        }
    }

    todosBtn.addEventListener('click', () => {
        tagsActivos.clear();
        paginaActual = 1;
        actualizarBotonesTag();
        render();
    });

    tagButtons.forEach(btn => {
        if (btn === todosBtn) return;
        btn.addEventListener('click', () => {
            const filtro = btn.dataset.filtro;
            if (tagsActivos.has(filtro)) {
                tagsActivos.delete(filtro);
            } else {
                tagsActivos.add(filtro);
            }
            paginaActual = 1;
            actualizarBotonesTag();
            render();
        });
    });

    pagPrev.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            render();
        }
    });

    pagNext.addEventListener('click', () => {
        paginaActual++;
        render();
    });

    render();
});

// *** beneficios / paso a paso: tarjetas pag servicios ***//

(function () {
    const track = document.getElementById('pasosTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.paso-card');
    const hoverCapable = window.matchMedia('(hover: hover)').matches;

    function activate(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
    }

    cards.forEach((card, i) => {
        if (hoverCapable) {
            card.addEventListener('mouseenter', () => activate(i));
        } else {
            card.addEventListener('click', () => activate(i));
        }
    });
})();

// *** efecto tilt pág bitácora *** //

(function () {

    const cards = document.querySelectorAll('.bitacora-card');

    cards.forEach(card => {

        card.addEventListener('mousemove', (e) => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 3;
            const rotateX = ((centerY - y) / centerY) * 3;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
            `;
        });

        card.addEventListener('mouseleave', () => {

            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
            `;
        });

    });

})();

// *** AOS animacionnn ***//

if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
    });
}