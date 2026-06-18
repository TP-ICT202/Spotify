import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import Video from 'react-native-video';

interface CanvasPlayerProps {
  videoUrl: string;
  paused: boolean;
}

const { width, height } = Dimensions.get('window');

const CanvasPlayer = ({
  videoUrl,
  paused,
}: CanvasPlayerProps) => {
  if (!videoUrl) return null;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted
        paused={paused}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
      />
    </View>
  );
};

export default memo(CanvasPlayer);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width,
    height,
  },
});
