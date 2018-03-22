export class BmpService {

  constructor () {
    this.currentBpmStorageKey = 'currentBpm';
    this.defaultBpm = 60;
  }

  getCurrentBpm() {
    return browser.storage.local.get(this.currentBpmStorageKey)
      .then(storage => storage[this.currentBpmStorageKey] || this.defaultBpm,
        err => this.defaultBpm);
  }

  setCurrentBpm(bpm) {
    browser.storage.local.set({
      [this.currentBpmStorageKey]: bpm
    });
  }
}
