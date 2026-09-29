import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

const categories = [
  {
    id: 'general',
    title: 'General Knowledge',
    description: 'World facts and everyday knowledge',
    emoji: '🌍',
  },
  {
    id: 'technology',
    title: 'Technology',
    description: 'Computers, coding and digital tech',
    emoji: '💻',
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Explore the world of science',
    emoji: '🔬',
  },
  {
    id: 'math',
    title: 'Mathematics',
    description: 'Numbers, calculations and logic',
    emoji: '➗',
  },
  {
    id: 'history',
    title: 'History',
    description: 'Events, people and civilizations',
    emoji: '📜',
  },
  {
    id: 'sports',
    title: 'Sports',
    description: 'Football, tennis and more',
    emoji: '⚽',
  },
];

export default function CategoriesScreen() {
  const selectCategory = (category: string) => {
    router.push({
      pathname: '/game',
      params: { category },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backTopButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.backTopText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>🧠</Text>
        </View>

        <Text style={styles.title}>
          Choose a Category
        </Text>

        <Text style={styles.subtitle}>
          Pick a topic and test your knowledge
        </Text>
      </View>

      {/* CATEGORY LIST */}
      <View style={styles.list}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => selectCategory(category.id)}
          >
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>
                {index + 1}
              </Text>
            </View>

            <View style={styles.emojiBox}>
              <Text style={styles.emoji}>
                {category.emoji}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardText}>
                {category.title}
              </Text>

              <Text style={styles.description}>
                {category.description}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footerCard}>
        <Text style={styles.footerEmoji}>⚡</Text>

        <View style={styles.footerContent}>
          <Text style={styles.footerTitle}>
            Ready to challenge yourself?
          </Text>

          <Text style={styles.footerText}>
            Choose a category and start your BrainRush.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back to Home
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111F',
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 35,
  },

  header: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },

  backTopButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#111D2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  backTopText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 30,
    marginTop: -3,
  },

  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
    marginBottom: 15,
  },

  headerEmoji: {
    fontSize: 38,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },

  list: {
    gap: 12,
  },

  card: {
    backgroundColor: '#111D2E',
    borderRadius: 18,
    padding: 14,
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  numberBox: {
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
  },

  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },

  emoji: {
    fontSize: 28,
  },

  cardContent: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 5,
  },

  cardText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  description: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },

  arrow: {
    color: '#60A5FA',
    fontSize: 30,
    marginLeft: 5,
  },

  footerCard: {
    backgroundColor: '#111D2E',
    borderRadius: 18,
    marginTop: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  footerEmoji: {
    fontSize: 25,
    marginRight: 12,
  },

  footerContent: {
    flex: 1,
  },

  footerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  footerText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  backText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '800',
  },
});
