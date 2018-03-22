import {
  MESSAGE_START, MESSAGE_STOP, MESSAGE_IS_PLAYING
} from './services/message-types';

const audio = new Audio('../assets/sounds/tick.mp3');

let isPlaying = false;
let currentBpm;

let playingInterval;

function handleMessage(request, sender, sendResponse) {
  switch (request.type) {
    case MESSAGE_START:
      isPlaying = true;
      clearPlayingInterval();
      let intervalMs = 60 * 1000 / request.bpm;
      playingInterval = setInterval(() => audio.play(), intervalMs);
      break;

    case MESSAGE_STOP:
      isPlaying = false;
      clearPlayingInterval();
      break;

    case MESSAGE_IS_PLAYING:
      sendResponse(isPlaying);
      break;

    default:
  }
}

function clearPlayingInterval() {
  if (playingInterval) {
    clearInterval(playingInterval);
    playingInterval = null;
  }
}

browser.runtime.onMessage.addListener(handleMessage);
