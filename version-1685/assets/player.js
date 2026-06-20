import { H as Hls } from './hls-dru42stk.js';

export function initPlayer(streamUrl) {
    const video = document.querySelector('[data-player-video]');
    const shell = document.querySelector('[data-player-shell]');
    const button = document.querySelector('[data-player-button]');
    const veil = document.querySelector('[data-player-veil]');
    let attached = false;
    let hls = null;

    if (!video || !streamUrl) {
        return;
    }

    function attachStream() {
        if (attached) {
            return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            return;
        }

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                    return;
                }

                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                    return;
                }

                hls.destroy();
            });
            return;
        }

        video.src = streamUrl;
    }

    function play() {
        attachStream();
        if (veil) {
            veil.classList.add('is-hidden');
        }
        const playRequest = video.play();
        if (playRequest && typeof playRequest.catch === 'function') {
            playRequest.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    if (shell) {
        shell.addEventListener('click', function (event) {
            if (event.target === video) {
                return;
            }
            if (button && !button.classList.contains('is-hidden')) {
                play();
            }
        });
    }

    video.addEventListener('play', function () {
        if (veil) {
            veil.classList.add('is-hidden');
        }
    });
}
