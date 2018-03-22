import './popup.css';
import {
  MESSAGE_START, MESSAGE_STOP, MESSAGE_GET_CURRENT_BPM, MESSAGE_IS_PLAYING
} from '../services/message-types';
import { BmpService } from '../services/bpm-service';

const scheduleButtonElement = document.querySelector('[data-schedule-button]');
const inputBpmElement = document.querySelector('[data-bpm-input]');
const rangeBpmElement = document.querySelector('[data-bpm-range]');
const decrementElement = document.querySelector('[data-decrement]');
const incrementElement = document.querySelector('[data-increment]');

const bpmService = new BmpService();
let isPlaying;
let currentBpm;

const minBpm = 20;
const maxBpm = 200;

initialize();

function initialize() {
  subscribeToEvents();
  setCurrentPlayingStatus();
  setInputConstraints();
}

function subscribeToEvents() {
  scheduleButtonElement.addEventListener('click', onSheduleButtonClick);
  decrementElement.addEventListener('click', onDecrementButtonClick);
  incrementElement.addEventListener('click', onIncrementButtonClick);
  rangeBpmElement.addEventListener('input', () => setNewBpm(+rangeBpmElement.value));
  inputBpmElement.addEventListener('input', () => setNewBpm(+inputBpmElement.value));
}

function onSheduleButtonClick() {
  if (isPlaying) {
    stopMetronome();
  } else {
    startMetronome();
  }
  updatePlayingStatus();
}

function onDecrementButtonClick() {
  if (currentBpm > minBpm) {
    setNewBpm(currentBpm - 1);
  }
}

function onIncrementButtonClick() {
  if (currentBpm < maxBpm) {
    setNewBpm(currentBpm + 1);
  }
}

function setCurrentPlayingStatus() {
  browser.runtime.sendMessage({
    type: MESSAGE_IS_PLAYING
  }).then(isPlay => {
    isPlaying = isPlay;
    updatePlayingStatus();
  });
  
  bpmService.getCurrentBpm()
    .then(bpm => setNewBpm(bpm));
}

function setInputConstraints() {
  inputBpmElement.setAttribute('min', minBpm);
  inputBpmElement.setAttribute('max', maxBpm);
  
  rangeBpmElement.setAttribute('min', minBpm);
  rangeBpmElement.setAttribute('max', maxBpm);
}

function updatePlayingStatus() {
  if (isPlaying) {
    scheduleButtonElement.classList.add('pause');
  } else {
    scheduleButtonElement.classList.remove('pause');
  }
}

function startMetronome() {
  isPlaying = true;
  browser.runtime.sendMessage({
    type: MESSAGE_START,
    bpm: currentBpm
  });
}

function stopMetronome() {
  isPlaying = false;
  browser.runtime.sendMessage({
    type: MESSAGE_STOP
  });
}

function setNewBpm(bpm) {
  currentBpm = bpm;
  rangeBpmElement.setAttribute('value', currentBpm);
  inputBpmElement.setAttribute('value', currentBpm);
  bpmService.setCurrentBpm(currentBpm);

  if (isPlaying) {
    startMetronome();
  }
}
