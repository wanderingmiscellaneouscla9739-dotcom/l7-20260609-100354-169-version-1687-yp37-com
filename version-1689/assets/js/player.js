import { H as Hls } from './hls-dru42stk.js';

const player = document.querySelector('[data-player]');
const trigger = document.querySelector('[data-play-trigger]');

if (player && trigger) {
  const streamUrl = player.getAttribute('data-stream');
  let prepared = false;
  let hlsInstance = null;

  const prepare = function () {
    if (prepared || !streamUrl) {
      return;
    }

    if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = streamUrl;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(player);
    } else {
      player.src = streamUrl;
    }

    prepared = true;
  };

  const play = function () {
    prepare();
    trigger.classList.add('is-hidden');
    player.controls = true;
    const result = player.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        trigger.classList.remove('is-hidden');
      });
    }
  };

  trigger.addEventListener('click', play);
  player.addEventListener('click', function () {
    if (player.paused) {
      play();
    }
  });
  player.addEventListener('play', function () {
    trigger.classList.add('is-hidden');
  });
  player.addEventListener('ended', function () {
    trigger.classList.remove('is-hidden');
  });
  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
