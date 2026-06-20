function queryAll(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
}

function setupMenu() {
    const button = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
        return;
    }

    button.addEventListener('click', function () {
        panel.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', panel.classList.contains('is-open'));
    });
}

function setupHero() {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
        return;
    }

    const slides = queryAll('[data-hero-slide]', carousel);
    const dots = queryAll('[data-hero-dot]', carousel);
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    }

    function move(step) {
        show(index + step);
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            move(1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    if (prev) {
        prev.addEventListener('click', function () {
            move(-1);
            start();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            move(1);
            start();
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            show(dotIndex);
            start();
        });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    start();
}

function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
}

function setupFilters() {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('q') || '';
    const scopes = queryAll('[data-filter-scope]');

    scopes.forEach(function (scope) {
        const input = scope.querySelector('.js-filter-input');
        const typeSelect = scope.querySelector('.js-filter-type');
        const yearSelect = scope.querySelector('.js-filter-year');
        const list = document.querySelector('[data-filter-list]');
        const empty = scope.querySelector('[data-filter-empty]');

        if (!list) {
            return;
        }

        const cards = queryAll('.movie-card', list);

        if (input && urlQuery) {
            input.value = urlQuery;
        }

        function apply() {
            const query = normalize(input ? input.value : '');
            const type = normalize(typeSelect ? typeSelect.value : '');
            const year = normalize(yearSelect ? yearSelect.value : '');
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.meta,
                    card.textContent
                ].join(' '));
                const cardType = normalize(card.dataset.type);
                const cardYear = normalize(card.dataset.year);
                const matchesQuery = !query || haystack.indexOf(query) !== -1;
                const matchesType = !type || cardType.indexOf(type) !== -1;
                const matchesYear = !year || cardYear === year;
                const matched = matchesQuery && matchesType && matchesYear;

                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    });
}

function setupJumpPlayer() {
    const link = document.querySelector('[data-jump-player]');
    const button = document.querySelector('[data-player-button]');
    if (!link || !button) {
        return;
    }

    link.addEventListener('click', function (event) {
        event.preventDefault();
        button.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupJumpPlayer();
});
