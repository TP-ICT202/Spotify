private sleepTimer: NodeJS.Timeout | null = null;

setSleepTimer(minutes: number) {
  if (this.sleepTimer) {
    clearTimeout(this.sleepTimer);
  }

  this.sleepTimer = setTimeout(async () => {
    await this.stop();
  }, minutes * 60 * 1000);
}

cancelSleepTimer() {
  if (this.sleepTimer) {
    clearTimeout(this.sleepTimer);
    this.sleepTimer = null;
  }
}sl
