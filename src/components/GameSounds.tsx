import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sounds = {
  correct: require('../../assets/sounds/correct.mp3'),
  wrong: require('../../assets/sounds/wrong.mp3'),
  streak: require('../../assets/sounds/streak.mp3'),
  achievement: require('../../assets/sounds/achievement.mp3'),
  complete: require('../../assets/sounds/complete.mp3'),
};

const SOUND_EFFECTS_KEY =
  'brainrush_sound_effects_enabled';

type GameSoundsProps = {
  sound?: keyof typeof sounds | null;
};

export default function GameSounds({
  sound = null,
}: GameSoundsProps) {
  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [preferenceLoaded, setPreferenceLoaded] =
    useState(false);

  const lastSound = useRef(sound);

  const player = useAudioPlayer(
    sound ? sounds[sound] : null
  );

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            SOUND_EFFECTS_KEY
          );

        if (saved !== null) {
          setSoundEnabled(saved === 'true');
        }
      } catch (error) {
        console.log(
          'Failed to load sound preference:',
          error
        );
      } finally {
        setPreferenceLoaded(true);
      }
    };

    loadPreference();
  }, []);

  useEffect(() => {
    if (
      !sound ||
      sound === lastSound.current ||
      !soundEnabled ||
      !preferenceLoaded
    ) {
      return;
    }

    lastSound.current = sound;

    player.seekTo(0);
    player.volume = 0.6;
    player.play();
  }, [
    sound,
    soundEnabled,
    preferenceLoaded,
    player,
  ]);

  const toggleSound = async () => {
    const newValue = !soundEnabled;

    setSoundEnabled(newValue);

    try {
      await AsyncStorage.setItem(
        SOUND_EFFECTS_KEY,
        String(newValue)
      );
    } catch (error) {
      console.log(
        'Failed to save sound preference:',
        error
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.soundButton}
        onPress={toggleSound}
      >
        <Text style={styles.soundIcon}>
          {soundEnabled ? '🔊' : '🔇'}
        </Text>

        <Text style={styles.soundText}>
          {soundEnabled
            ? 'Sound On'
            : 'Sound Off'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 95,
    right: 16,
    zIndex: 100,
  },

  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor:
      'rgba(15, 23, 42, 0.92)',
  },

  soundIcon: {
    fontSize: 16,
    marginRight: 5,
  },

  soundText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});