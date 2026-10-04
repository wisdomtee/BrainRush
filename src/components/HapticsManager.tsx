import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HAPTICS_KEY =
  'brainrush_haptics_enabled';

type HapticType =
  | 'correct'
  | 'wrong'
  | 'streak'
  | 'achievement'
  | 'complete';

type HapticsManagerProps = {
  type?: HapticType | null;
};

export default function HapticsManager({
  type = null,
}: HapticsManagerProps) {
  const [hapticsEnabled, setHapticsEnabled] =
    useState(true);

  const [preferenceLoaded, setPreferenceLoaded] =
    useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            HAPTICS_KEY
          );

        if (saved !== null) {
          setHapticsEnabled(
            saved === 'true'
          );
        }
      } catch (error) {
        console.log(
          'Failed to load haptics preference:',
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
      !type ||
      !hapticsEnabled ||
      !preferenceLoaded
    ) {
      return;
    }

    const triggerHaptic = async () => {
      try {
        switch (type) {
          case 'correct':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            break;

          case 'wrong':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            );
            break;

          case 'streak':
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Medium
            );
            break;

          case 'achievement':
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            break;

          case 'complete':
            await Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Heavy
            );
            break;
        }
      } catch (error) {
        console.log(
          'Haptic feedback failed:',
          error
        );
      }
    };

    triggerHaptic();
  }, [
    type,
    hapticsEnabled,
    preferenceLoaded,
  ]);

  const toggleHaptics = async () => {
    const newValue = !hapticsEnabled;

    setHapticsEnabled(newValue);

    try {
      await AsyncStorage.setItem(
        HAPTICS_KEY,
        String(newValue)
      );
    } catch (error) {
      console.log(
        'Failed to save haptics preference:',
        error
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.hapticsButton}
        onPress={toggleHaptics}
      >
        <Text style={styles.hapticsIcon}>
          {hapticsEnabled ? '📳' : '📴'}
        </Text>

        <Text style={styles.hapticsText}>
          {hapticsEnabled
            ? 'Haptics On'
            : 'Haptics Off'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 135,
    right: 16,
    zIndex: 100,
  },

  hapticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor:
      'rgba(15, 23, 42, 0.92)',
  },

  hapticsIcon: {
    fontSize: 16,
    marginRight: 5,
  },

  hapticsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});