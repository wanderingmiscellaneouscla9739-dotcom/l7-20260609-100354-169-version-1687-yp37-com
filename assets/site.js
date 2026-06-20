const menuButton = document.querySelector('.menu-toggle');
const mobilePanel = document.querySelector('.mobile-panel');

if (menuButton && mobilePanel) {
  menuButton.addEventListener('click', () => {
    const opened = mobilePanel.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
}

const hero = document.querySelector('[data-hero-carousel]');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const next = hero.querySelector('[data-hero-next]');
  const prev = hero.querySelector('[data-hero-prev]');
  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5200);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.heroDot || 0));
      start();
    });
  });

  next?.addEventListener('click', () => {
    show(index + 1);
    start();
  });

  prev?.addEventListener('click', () => {
    show(index - 1);
    start();
  });

  start();
}

const normalize = (value) => (value || '').toString().trim().toLowerCase();

const applySearch = (root) => {
  const input = root.querySelector('.local-search');
  const cards = Array.from(root.querySelectorAll('.movie-card'));
  const chips = Array.from(root.querySelectorAll('.filter-chip'));
  let activeFilter = 'all';

  const update = () => {
    const query = normalize(input?.value);
    cards.forEach((card) => {
      const target = normalize([
        card.dataset.title,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.year,
        card.dataset.category,
        card.textContent
      ].join(' '));
      const typeMatch = activeFilter === 'all' || target.includes(normalize(activeFilter));
      const textMatch = !query || target.includes(query);
      card.classList.toggle('hidden-by-filter', !(typeMatch && textMatch));
    });
  };

  input?.addEventListener('input', update);
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter || 'all';
      chips.forEach((item) => item.classList.toggle('active', item === chip));
      update();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q && input) {
    input.value = q;
    update();
  }
};

document.querySelectorAll('.filter-section').forEach(applySearch);

document.querySelectorAll('[data-rail]').forEach((rail) => {
  const track = rail.querySelector('.rail-track');
  const prev = rail.querySelector('.rail-prev');
  const next = rail.querySelector('.rail-next');

  const move = (direction) => {
    if (!track) return;
    const amount = Math.max(260, track.clientWidth * 0.72);
    track.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
});
