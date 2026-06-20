
var hlsLoader = null;

function loadHlsLibrary() {
  if (window.Hls) {
    return Promise.resolve(window.Hls);
  }
  if (hlsLoader) {
    return hlsLoader;
  }
  hlsLoader = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    script.async = true;
    script.onload = function () {
      if (window.Hls) {
        resolve(window.Hls);
      } else {
        reject(new Error('Hls unavailable'));
      }
    };
    script.onerror = function () {
      reject(new Error('Hls load failed'));
    };
    document.head.appendChild(script);
  });
  return hlsLoader;
}

export function initializeMoviePlayer(options) {
  var root = document.querySelector(options.selector);
  if (!root) {
    return;
  }

  var video = root.querySelector('video');
  var cover = root.querySelector('.player-cover');
  var source = options.source;
  var hlsInstance = null;
  var prepared = false;

  function prepare() {
    if (prepared || !video || !source) {
      return Promise.resolve();
    }
    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    return loadHlsLibrary().then(function (Hls) {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }).catch(function () {
      video.src = source;
    });
  }

  function play() {
    prepare().then(function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playback = video.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }
    });
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
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 && cover) {
        cover.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
