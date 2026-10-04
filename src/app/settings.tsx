import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MUSIC_KEY = 'brainrush_music_enabled';
const SOUND_KEY = 'brainrush_sound_effects_enabled';
const HAPTICS_KEY = 'brainrush_haptics_enabled';
const PLAYER_NAME_KEY = 'playerName';

export default function SettingsScreen() {
  const router = useRouter();

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [
          savedMusic,
          savedSound,
          savedHaptics,
          savedName,
        ] = await Promise.all([
          AsyncStorage.getItem(MUSIC_KEY),
          AsyncStorage.getItem(SOUND_KEY),
          AsyncStorage.getItem(HAPTICS_KEY),
          AsyncStorage.getItem(PLAYER_NAME_KEY),
        ]);

        if (savedMusic !== null) {
          setMusicEnabled(savedMusic === 'true');
        }

        if (savedSound !== null) {
          setSoundEnabled(savedSound === 'true');
        }

        if (savedHaptics !== null) {
          setHapticsEnabled(savedHaptics === 'true');
        }

        if (savedName !== null) {
          setPlayerName(savedName);
        }
      } catch (error) {
        console.log(
          'Failed to load settings:',
          error
        );
      } finally {
        setLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const updateMusic = async (value: boolean) => {
    setMusicEnabled(value);

    await AsyncStorage.setItem(
      MUSIC_KEY,
      String(value)
    );
  };

  const updateSound = async (value: boolean) => {
    setSoundEnabled(value);

    await AsyncStorage.setItem(
      SOUND_KEY,
      String(value)
    );
  };

  const updateHaptics = async (value: boolean) => {
    setHapticsEnabled(value);

    await AsyncStorage.setItem(
      HAPTICS_KEY,
      String(value)
    );
  };

  const savePlayerName = async () => {
    const trimmedName =
      playerName.trim();

    if (!trimmedName) {
      Alert.alert(
        'Enter a name',
        'Please enter your player name.'
      );
      return;
    }

    await AsyncStorage.setItem(
      PLAYER_NAME_KEY,
      trimmedName
    );

    setPlayerName(trimmedName);

    Alert.alert(
      'Saved',
      'Your player name has been updated.'
    );
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will remove your BrainRush progress, including your stats, leaderboard score, achievements, and XP.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const keysToRemove = [
                'bestScore',
                'bestStreak',
                'gamesPlayed',
                'leaderboard',
                'achievements',
                'playerXP',
                'playerLevel',
                'dailyChallengeCompleted',
                'lastQuizReview',
              ];

              await AsyncStorage.multiRemove(
                keysToRemove
              );

              Alert.alert(
                'Progress Reset',
                'Your BrainRush progress has been reset.'
              );
            } catch (error) {
              console.log(
                'Failed to reset progress:',
                error
              );

              Alert.alert(
                'Error',
                'Unable to reset progress.'
              );
            }
          },
        },
      ]
    );
  };

  if (!loaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading settings...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <View>
          <Text style={styles.title}>
            Settings
          </Text>

          <Text style={styles.subtitle}>
            Customize your BrainRush experience
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          AUDIO & FEEDBACK
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingIcon}>
              🎵
            </Text>

            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>
                Background Music
              </Text>

              <Text style={styles.settingDescription}>
                Play music while you play
              </Text>
            </View>
          </View>

          <Switch
            value={musicEnabled}
            onValueChange={updateMusic}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingIcon}>
              🔊
            </Text>

            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>
                Sound Effects
              </Text>

              <Text style={styles.settingDescription}>
                Play answer and achievement sounds
              </Text>
            </View>
          </View>

          <Switch
            value={soundEnabled}
            onValueChange={updateSound}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingIcon}>
              📳
            </Text>

            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>
                Haptic Feedback
              </Text>

              <Text style={styles.settingDescription}>
                Vibrate for important game events
              </Text>
            </View>
          </View>

          <Switch
            value={hapticsEnabled}
            onValueChange={updateHaptics}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          PLAYER PROFILE
        </Text>

        <Text style={styles.inputLabel}>
          Player Name
        </Text>

        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Enter your name"
          placeholderTextColor="#64748B"
          style={styles.input}
          maxLength={20}
        />

        <Pressable
          style={styles.saveButton}
          onPress={savePlayerName}
        >
          <Text style={styles.saveButtonText}>
            Save Name
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          DATA
        </Text>

        <Pressable
          style={styles.resetButton}
          onPress={resetProgress}
        >
          <Text style={styles.resetButtonText}>
            Reset Game Progress
          </Text>
        </Pressable>

        <Text style={styles.resetDescription}>
          Removes your saved stats, XP, achievements,
          leaderboard score and review history.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
  },

  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    marginRight: 14,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    marginTop: -4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  settingRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  settingIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  settingTextBox: {
    flex: 1,
  },

  settingTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  settingDescription: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
  },

  inputLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  saveButton: {
    height: 50,
    marginTop: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  resetButton: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F1720',
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },

  resetButtonText: {
    color: '#FCA5A5',
    fontSize: 15,
    fontWeight: '800',
  },

  resetDescription: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },
});