import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tracks = [
  require('../../assets/music/track1.mp3'),
  require('../../assets/music/track2.mp3'),
  require('../../assets/music/track3.mp3'),
];

const MUSIC_PREFERENCE_KEY = 'brainrush_music_enabled';

type BackgroundMusicProps = {
  playing?: boolean;
};

export function BackgroundMusic({
  playing = true,
}: BackgroundMusicProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  const changingTrack = useRef(false);

  const player = useAudioPlayer(tracks[currentTrack], {
    updateInterval: 500,
  });

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    const loadMusicPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(
          MUSIC_PREFERENCE_KEY
        );

        if (savedPreference !== null) {
          setMusicEnabled(savedPreference === 'true');
        }
      } catch (error) {
        console.log(
          'Failed to load music preference:',
          error
        );
      } finally {
        setPreferenceLoaded(true);
      }
    };

    loadMusicPreference();
  }, []);

  useEffect(() => {
    player.volume = 0.55;
    player.loop = false;
  }, [player]);

  useEffect(() => {
    if (!preferenceLoaded) {
      return;
    }

    if (playing && musicEnabled) {
      player.play();
    } else {
      player.pause();
    }
  }, [
    playing,
    musicEnabled,
    preferenceLoaded,
    player,
  ]);

  useEffect(() => {
    if (
      !status.didJustFinish ||
      changingTrack.current
    ) {
      return;
    }

    changingTrack.current = true;

    const nextTrack =
      (currentTrack + 1) % tracks.length;

    setCurrentTrack(nextTrack);

    setTimeout(() => {
      changingTrack.current = false;
    }, 300);
  }, [
    status.didJustFinish,
    currentTrack,
  ]);

  useEffect(() => {
    if (
      status.isLoaded &&
      playing &&
      musicEnabled &&
      preferenceLoaded
    ) {
      player.play();
    }
  }, [
    currentTrack,
    status.isLoaded,
    playing,
    musicEnabled,
    preferenceLoaded,
    player,
  ]);

  const toggleMusic = async () => {
    const newValue = !musicEnabled;

    setMusicEnabled(newValue);

    try {
      await AsyncStorage.setItem(
        MUSIC_PREFERENCE_KEY,
        String(newValue)
      );
    } catch (error) {
      console.log(
        'Failed to save music preference:',
        error
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.musicButton}
        onPress={toggleMusic}
      >
        <Text style={styles.musicIcon}>
          {musicEnabled ? '🎵' : '🔇'}
        </Text>

        <Text style={styles.musicText}>
          {musicEnabled ? 'Music On' : 'Music Off'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 55,
    right: 16,
    zIndex: 100,
  },

  musicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },

  musicIcon: {
    fontSize: 16,
    marginRight: 5,
  },

  musicText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});