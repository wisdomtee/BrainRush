import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [existingName, setExistingName] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const savedName = await AsyncStorage.getItem('playerName');

      if (savedName) {
        setExistingName(savedName);
        setName(savedName);
      }
    } catch (error) {
      console.log('Failed to load player name:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const saveName = async () => {
    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert(
        'Name Required',
        'Please enter your name to continue.'
      );
      return;
    }

    try {
      await AsyncStorage.setItem('playerName', cleanName);
      router.replace('/');
    } catch (error) {
      console.log('Failed to save player name:', error);
    }
  };

  const isEditing = Boolean(existingName);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          {isEditing ? (
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpace} />
          )}

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>PLAYER PROFILE</Text>

            <Text style={styles.headerSubtitle}>
              BRAIN RUSH
            </Text>
          </View>

          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logoCircle}>
              <Text style={styles.logo}>🧠</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isEditing ? 'EDIT PLAYER' : 'NEW PLAYER'}
              </Text>
            </View>

            <Text style={styles.title}>
              {isEditing
                ? 'Update Your Profile'
                : 'Welcome to BrainRush'}
            </Text>

            <Text style={styles.subtitle}>
              {isEditing
                ? 'Change the name used across your game.'
                : 'Let’s get your player profile ready.'}
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.label}>PLAYER NAME</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
                maxLength={30}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={saveName}
              />

              <Text style={styles.helper}>
                This name will appear on the leaderboard.
              </Text>

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={saveName}
              >
                <View style={styles.buttonIcon}>
                  <Text style={styles.buttonIconText}>✓</Text>
                </View>

                <Text style={styles.buttonText}>
                  {isEditing
                    ? 'SAVE CHANGES'
                    : 'START PLAYING'}
                </Text>

                <Text style={styles.buttonArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Text>🏆</Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  Build your BrainRush profile
                </Text>

                <Text style={styles.infoText}>
                  Your scores, streaks, XP, achievements,
                  and leaderboard progress are connected
                  to your player name.
                </Text>
              </View>
            </View>

            <Text style={styles.footer}>
              BrainRush • Think Fast. Answer Faster.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    height: 74,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
    marginTop: -3,
  },

  headerSpace: {
    width: 44,
    height: 44,
  },

  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  headerSubtitle: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 3,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 30,
  },

  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logo: {
    fontSize: 42,
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1D4ED8',
    marginBottom: 14,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
  },

  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  label: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  input: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 9,
  },

  helper: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 18,
  },

  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  buttonIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  buttonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },

  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '300',
  },

  infoCard: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },

  infoText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },

  footer: {
    color: '#475569',
    fontSize: 11,
    marginTop: 22,
    textAlign: 'center',
  },
});