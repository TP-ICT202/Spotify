import { useMemo } from 'react';

export function useSyncedLyrics(
  currentPosition: number,
  lyrics: { time: number; text: string }[],
) {
  return useMemo(() => {
    let activeIndex = 0;

    for (let i = 0; i < lyrics.length; i++) {
      if (currentPosition >= lyrics[i].time) {
        activeIndex = i;
      }
    }

    return activeIndex;
  }, [currentPosition, lyrics]);
}
