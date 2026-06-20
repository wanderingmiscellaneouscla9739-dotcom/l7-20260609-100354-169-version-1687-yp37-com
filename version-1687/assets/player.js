import { H as Hls } from './hls-dru42stk.js';

export function initPlayer(sourceUrl) {
  const shell = document.querySelector('[data-player]');
  if (!shell) return;

  const video = shell.querySelector('video');
  const button = shell.querySelector('.play-button');
  let ready = false;
  let hls = null;

  const attach = () => {
    if (!video || ready) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data || !data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
          hls = null;
        }
      });
    } else {
      video.src = sourceUrl;
    }

    ready = true;
  };

  const play = async () => {
    attach();
    shell.classList.add('playing');
    video.controls = true;
    try {
      await video.play();
    } catch (error) {
      shell.classList.remove('playing');
    }
  };

  shell.addEventListener('click', (event) => {
    if (event.target && event.target.closest('video')) return;
    play();
  });

  button?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    play();
  });

  video?.addEventListener('play', () => shell.classList.add('playing'));
  video?.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) shell.classList.remove('playing');
  });
}
