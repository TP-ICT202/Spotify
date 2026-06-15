class AudioEngine {
  private currentTrack: any;
  private nextTrack: any;

  async crossfade(
    currentTrack: any,
    nextTrack: any,
    duration = 5000,
  ) {
    const interval = 100;
    const steps = duration / interval;

    let currentVolume = 1;
    let nextVolume = 0;

    await nextTrack.setVolume(0);
    await nextTrack.play();

    const fadeInterval = setInterval(async () => {
      currentVolume -= 1 / steps;
      nextVolume += 1 / steps;

      if (currentVolume < 0) currentVolume = 0;
      if (nextVolume > 1) nextVolume = 1;

      await currentTrack.setVolume(currentVolume);
      await nextTrack.setVolume(nextVolume);

      if (nextVolume >= 1) {
        clearInterval(fadeInterval);

        await currentTrack.stop();
      }
    }, interval);
  }
}

export default new AudioEngine();
