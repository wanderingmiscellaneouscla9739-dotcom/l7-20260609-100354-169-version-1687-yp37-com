(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var index = 0;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });

            show(0);
            setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        var searchParams = new URLSearchParams(window.location.search);
        var query = searchParams.get("q");
        var searchInput = document.querySelector("[data-filter-search]");
        if (query && searchInput) {
            searchInput.value = query;
        }

        var filters = document.querySelectorAll("[data-filter-search], [data-filter-type], [data-filter-year]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search]"));
        if (filters.length && cards.length) {
            function applyFilters() {
                var text = (document.querySelector("[data-filter-search]") || {}).value || "";
                var type = (document.querySelector("[data-filter-type]") || {}).value || "";
                var year = (document.querySelector("[data-filter-year]") || {}).value || "";
                var keyword = text.trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardType = card.getAttribute("data-type") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var matched = true;
                    if (keyword && haystack.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (type && cardType !== type) {
                        matched = false;
                    }
                    if (year && cardYear !== year) {
                        matched = false;
                    }
                    card.classList.toggle("hidden-by-filter", !matched);
                });
            }

            filters.forEach(function (filter) {
                filter.addEventListener("input", applyFilters);
                filter.addEventListener("change", applyFilters);
            });
            applyFilters();
        }
    });
})();

function initMoviePlayer(url) {
    var video = document.getElementById("movie-player");
    var overlay = document.getElementById("player-overlay");
    var loaded = false;
    var hls = null;

    if (!video || !overlay || !url) {
        return;
    }

    function attach() {
        if (loaded) {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
        } else if (window.Hls && Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else {
            video.src = url;
        }
        loaded = true;
    }

    function play() {
        attach();
        overlay.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
}
