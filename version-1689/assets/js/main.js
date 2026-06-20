(function () {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const setHeaderState = function () {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;
    let timer = null;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const startTimer = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-hero-dot'));
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  const filterBars = Array.from(document.querySelectorAll('[data-filter-bar]'));

  filterBars.forEach(function (bar) {
    const container = document.querySelector('[data-card-container]');
    const searchInput = bar.querySelector('[data-filter-search]');
    const typeSelect = bar.querySelector('[data-filter-type]');
    const yearSelect = bar.querySelector('[data-filter-year]');

    if (!container || !searchInput || !typeSelect || !yearSelect) {
      return;
    }

    const cards = Array.from(container.querySelectorAll('[data-card]'));

    const normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };

    const applyFilter = function () {
      const keyword = normalize(searchInput.value);
      const selectedType = normalize(typeSelect.value);
      const selectedYear = normalize(yearSelect.value);

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        const typeText = normalize(card.getAttribute('data-type'));
        const yearText = normalize(card.getAttribute('data-year'));
        const matchedKeyword = !keyword || haystack.includes(keyword);
        const matchedType = !selectedType || typeText === selectedType;
        const matchedYear = !selectedYear || yearText === selectedYear;
        card.classList.toggle('is-filtered-out', !(matchedKeyword && matchedType && matchedYear));
      });
    };

    searchInput.addEventListener('input', applyFilter);
    typeSelect.addEventListener('change', applyFilter);
    yearSelect.addEventListener('change', applyFilter);
  });
})();
