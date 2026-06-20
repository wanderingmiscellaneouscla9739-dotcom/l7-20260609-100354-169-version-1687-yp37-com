(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var navButton = document.querySelector('[data-toggle-nav]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    selectAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = selectAll('[data-hero-slide]', carousel);
        var dots = selectAll('[data-hero-dot]', carousel);
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        show(0);
        start();
    });

    function applyFilters(root) {
        var search = root.querySelector('[data-movie-search]');
        var selects = selectAll('[data-filter-field]', root);
        var cards = selectAll('.movie-card', root);

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function update() {
            var keyword = normalize(search ? search.value : '');
            var filters = {};

            selects.forEach(function (select) {
                filters[select.getAttribute('data-filter-field')] = normalize(select.value);
            });

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.type
                ].join(' '));

                var visible = !keyword || haystack.indexOf(keyword) !== -1;

                Object.keys(filters).forEach(function (key) {
                    var value = filters[key];
                    if (value && normalize(card.dataset[key]).indexOf(value) === -1) {
                        visible = false;
                    }
                });

                card.classList.toggle('is-hidden', !visible);
            });
        }

        if (search) {
            search.addEventListener('input', update);
        }

        selects.forEach(function (select) {
            select.addEventListener('change', update);
        });
    }

    applyFilters(document);

    selectAll('.player-shell').forEach(function (shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        var source = shell.getAttribute('data-video');
        var ready = false;
        var hlsPlayer = null;

        function prepare() {
            if (!video || !source || ready) {
                return;
            }

            ready = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsPlayer = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsPlayer.loadSource(source);
                hlsPlayer.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            prepare();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (cover) {
                        cover.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsPlayer) {
                hlsPlayer.destroy();
            }
        });
    });
})();
