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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
const router = useRouter();

const [name, setName] = useState('');
const [existingName, setExistingName] = useState('');

const loadProfile = useCallback(async () => {
try {
const savedName =
await AsyncStorage.getItem('playerName');

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
  await AsyncStorage.setItem(
    'playerName',
    cleanName
  );

  router.replace('/');
} catch (error) {
  console.log('Failed to save player name:', error);
}

};

const isEditing = Boolean(existingName);

return ( <SafeAreaView style={styles.container}>
<KeyboardAvoidingView
style={styles.keyboard}
behavior={
Platform.OS === 'ios'
? 'padding'
: undefined
}
> <View style={styles.header}>
{isEditing ? (
<TouchableOpacity
style={styles.backButton}
activeOpacity={0.8}
onPress={() => router.back()}
> <Text style={styles.backText}>‹</Text> </TouchableOpacity>
) : ( <View style={styles.headerSpace} />
)}

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          PLAYER PROFILE
        </Text>

        <Text style={styles.headerSubtitle}>
          BRAIN RUSH
        </Text>
      </View>

      <View style={styles.headerSpace} />
    </View>

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
        <Text style={styles.label}>
          PLAYER NAME
        </Text>

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
            <Text style={styles.buttonIconText}>
              ✓
            </Text>
          </View>

          <Text style={styles.buttonText}>
            {isEditing
              ? 'SAVE CHANGES'
              : 'START PLAYING'}
          </Text>

          <Text style={styles.buttonArrow}>
            ›
          </Text>
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
flex: 1,
alignItems: 'center',
paddingHorizontal: 22,
paddingTop: 28,
},

logoCircle: {
width: 92,
height: 92,
borderRadius: 46,
backgroundColor: '#172554',
borderWidth: 2,
borderColor: '#2563EB',
alignItems: 'center',
justifyContent: 'center',
shadowColor: '#2563EB',
shadowOpacity: 0.25,
shadowRadius: 14,
shadowOffset: {
width: 0,
height: 6,
},
elevation: 6,
},

logo: {
fontSize: 48,
},

badge: {
marginTop: 18,
paddingHorizontal: 13,
paddingVertical: 6,
borderRadius: 20,
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#2563EB',
},

badgeText: {
color: '#60A5FA',
fontSize: 10,
fontWeight: '900',
letterSpacing: 1.4,
},

title: {
color: '#FFFFFF',
fontSize: 26,
fontWeight: '900',
textAlign: 'center',
marginTop: 14,
letterSpacing: 0.2,
},

subtitle: {
color: '#94A3B8',
fontSize: 14,
textAlign: 'center',
marginTop: 8,
lineHeight: 21,
},

formCard: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 22,
padding: 18,
marginTop: 24,
borderWidth: 1,
borderColor: '#334155',
},

label: {
color: '#CBD5E1',
fontSize: 11,
fontWeight: '900',
letterSpacing: 1.2,
marginBottom: 9,
},

input: {
width: '100%',
height: 56,
backgroundColor: '#0F172A',
borderWidth: 1,
borderColor: '#475569',
borderRadius: 15,
color: '#FFFFFF',
fontSize: 17,
fontWeight: '600',
paddingHorizontal: 17,
},

helper: {
color: '#64748B',
fontSize: 11,
marginTop: 9,
lineHeight: 17,
},

button: {
height: 56,
backgroundColor: '#2563EB',
borderRadius: 15,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
marginTop: 16,
paddingHorizontal: 14,
},

buttonIcon: {
width: 28,
height: 28,
borderRadius: 14,
backgroundColor: '#FFFFFF',
alignItems: 'center',
justifyContent: 'center',
marginRight: 9,
},

buttonIconText: {
color: '#2563EB',
fontSize: 17,
fontWeight: '900',
},

buttonText: {
color: '#FFFFFF',
fontSize: 15,
fontWeight: '900',
letterSpacing: 0.8,
},

buttonArrow: {
color: '#FFFFFF',
fontSize: 28,
fontWeight: '300',
marginLeft: 'auto',
},

infoCard: {
width: '100%',
flexDirection: 'row',
backgroundColor: '#172554',
borderRadius: 18,
padding: 15,
marginTop: 14,
borderWidth: 1,
borderColor: '#1D4ED8',
},

infoIcon: {
width: 42,
height: 42,
borderRadius: 13,
backgroundColor: '#1E3A8A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 12,
},

infoContent: {
flex: 1,
},

infoTitle: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '800',
marginBottom: 4,
},

infoText: {
color: '#BFDBFE',
fontSize: 11,
lineHeight: 17,
},

footer: {
color: '#475569',
fontSize: 10,
marginTop: 'auto',
marginBottom: 18,
textAlign: 'center',
},
});
