import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { questionBanks, Question, CategoryKey } from '../data/questions';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import GameSounds from '@/components/GameSounds';
import HapticsManager from '@/components/HapticsManager';

type ReviewItem = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

const achievementDetails: Record<string, Achievement> = {
  first_game: {
    id: 'first_game',
    title: 'First Game',
    description: 'You completed your first quiz!',
    emoji: '🥉',
  },
  hot_streak: {
    id: 'hot_streak',
    title: 'Hot Streak',
    description: 'You got 3 correct answers in a row!',
    emoji: '🔥',
  },
  brain_master: {
    id: 'brain_master',
    title: 'Brain Master',
    description: 'You scored 5 out of 5!',
    emoji: '🧠',
  },
  perfect_player: {
    id: 'perfect_player',
    title: 'Perfect Player',
    description: 'You completed a perfect quiz!',
    emoji: '🎯',
  },
  knowledge_seeker: {
    id: 'knowledge_seeker',
    title: 'Category Explorer',
    description: 'You played all 10 categories!',
    emoji: '🧭',
  },
  quiz_veteran: {
    id: 'quiz_veteran',
    title: 'Quiz Veteran',
    description: 'You completed 10 quizzes!',
    emoji: '🏆',
  },

  category_specialist: {
    id: 'category_specialist',
    title: 'Category Specialist',
    description: 'You reached a 4/5 average in a category!',
    emoji: '🔥',
  },

  category_master: {
  id: 'category_master',
  title: 'Category Master',
  description: 'You reached a 5/5 average in a category!',
  emoji: '💎',
},

all_rounder: {
  id: 'all_rounder',
  title: 'All-Rounder',
  description: 'You reached a 3/5 average across all 10 categories!',
  emoji: '🌍',
},
};

const TIME_PER_QUESTION = 15;

const shuffleArray = <T,>(array: T[]): T[] => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const createQuizQuestions = (
  bank: Question[],
  count = 5
): Question[] => {
  return shuffleArray(bank)
    .slice(0, count)
    .map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
};

export default function GameScreen() {
  const { category } = useLocalSearchParams<{
    category?: string;
  }>();

  const selectedCategory =
    (category as CategoryKey) || 'general';

    const [questions, setQuestions] = useState<Question[]>([]);
const [questionsReady, setQuestionsReady] = useState(false);
const [soundEffect, setSoundEffect] = useState<
  'correct' | 'wrong' | 'streak' | 'achievement' | 'complete' | null
>(null);

const [hapticEffect, setHapticEffect] = useState<
  'correct' | 'wrong' | 'streak' | 'achievement' | 'complete' | null
>(null);

useEffect(() => {
  const loadQuizQuestions = async () => {
    try {
      const bank =
        questionBanks[selectedCategory] ||
        questionBanks.general;

      const storageKey =
        `recentQuestions_${selectedCategory}`;

      const savedRecent =
        await AsyncStorage.getItem(storageKey);

      const recentIds: string[] =
        savedRecent ? JSON.parse(savedRecent) : [];

      let availableQuestions = bank.filter(
        (question) => !recentIds.includes(question.id)
      );

      // If there aren't enough unseen questions,
      // start using the full bank again.
      if (availableQuestions.length < 5) {
        availableQuestions = bank;
      }

      const selectedQuestions =
        createQuizQuestions(
          availableQuestions,
          5
        );

      setQuestions(selectedQuestions);

      const newRecentIds = [
        ...recentIds,
        ...selectedQuestions.map(
          (question) => question.id
        ),
      ].slice(-5);

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(newRecentIds)
      );
    } catch (error) {
      console.log(
        'Failed to load quiz questions:',
        error
      );

      const fallback =
        questionBanks[selectedCategory] ||
        questionBanks.general;

      setQuestions(
        createQuizQuestions(fallback, 5)
      );
    } finally {
      setQuestionsReady(true);
    }
  };

  loadQuizQuestions();
}, [selectedCategory]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] =
    useState(TIME_PER_QUESTION);

  const [selected, setSelected] =
    useState<string | null>(null);

  const [showExplanation, setShowExplanation] =
    useState(false);

  const [reviewAnswers, setReviewAnswers] =
    useState<ReviewItem[]>([]);

  const [newAchievements, setNewAchievements] =
    useState<Achievement[]>([]);

  const [showAchievementPopup, setShowAchievementPopup] =
    useState(false);

  const [pendingResult, setPendingResult] =
    useState<{
      score: number;
      streak: number;
    } | null>(null);

  const categoryNames: Record<CategoryKey, string> = {
  general: 'General Knowledge',
  technology: 'Technology',
  science: 'Science',
  math: 'Mathematics',
  history: 'History',
  sports: 'Sports',
  geography: 'Geography',
  programming: 'Programming',
  entertainment: 'Entertainment',
  space: 'Space',
};

  const categoryName =
    categoryNames[selectedCategory];

  const question = questions[currentQuestion];


  const checkAchievements = async (
    finalScore: number,
    finalBestStreak: number
  ): Promise<Achievement[]> => {
    try {
      const saved =
        await AsyncStorage.getItem('achievements');

      const existingAchievements: string[] =
        saved ? JSON.parse(saved) : [];

      const newlyUnlocked: string[] = [];

      const playAchievementSound = () => {
        setSoundEffect('achievement');
        setTimeout(() => {
          setSoundEffect(null);
        }, 500);
      };

      const unlockIfNew = (
        achievementId: string
      ) => {
        if (
          !existingAchievements.includes(
            achievementId
          )
        ) {
          existingAchievements.push(
            achievementId
          );

          newlyUnlocked.push(
            achievementId
          );
        }
      };

      unlockIfNew('first_game');

      if (finalScore === questions.length) {
        unlockIfNew('brain_master');
        unlockIfNew('perfect_player');
      }

      if (finalBestStreak >= 3) {
        unlockIfNew('hot_streak');
      }

      const savedCategories =
        await AsyncStorage.getItem(
          'playedCategories'
        );

      const playedCategories: string[] =
        savedCategories
          ? JSON.parse(savedCategories)
          : [];

      if (
        !playedCategories.includes(
          selectedCategory
        )
      ) {
        playedCategories.push(
          selectedCategory
        );
      }

      await AsyncStorage.setItem(
        'playedCategories',
        JSON.stringify(playedCategories)
      );

      if (playedCategories.length >= 10) {
        unlockIfNew('knowledge_seeker');
      }

      const categoryKeys: CategoryKey[] = [
        'general',
        'technology',
        'science',
        'math',
        'history',
        'sports',
        'geography',
        'programming',
        'entertainment',
        'space',
      ];

      for (const key of categoryKeys) {
        const historyKey =
          'categoryHistory_' + key;

        const history =
          await AsyncStorage.getItem(
            historyKey
          );

        if (history === null) {
          continue;
        }

        const scores: number[] =
          JSON.parse(history);

        if (scores.length === 0) {
          continue;
        }

        const average =
          scores.reduce(
            (total, value) => total + value,
            0
          ) / scores.length;

        if (average >= 5) {
          unlockIfNew('category_master');
          unlockIfNew('category_specialist');
        } else if (average >= 4) {
          unlockIfNew('category_specialist');
        }

      }

            const allCategoryAverages: number[] = [];

      for (const key of categoryKeys) {
        const historyKey =
          'categoryHistory_' + key;

        const history =
          await AsyncStorage.getItem(
            historyKey
          );

        if (history === null) {
          continue;
        }

        const scores: number[] =
          JSON.parse(history);

        if (scores.length === 0) {
          continue;
        }

        const average =
          scores.reduce(
            (total, value) => total + value,
            0
          ) / scores.length;

        allCategoryAverages.push(average);
      }

      if (
        allCategoryAverages.length === 10 &&
        allCategoryAverages.every(
          (average) => average >= 3
        )
      ) {
        unlockIfNew('all_rounder');
      }

      const currentGames =
        Number(
          (await AsyncStorage.getItem(
            'gamesPlayed'
          )) || 0
        );

      if (currentGames >= 10) {
        unlockIfNew('quiz_veteran');
      }

      await AsyncStorage.setItem(
        'achievements',
        JSON.stringify(existingAchievements)
      );

      if (newlyUnlocked.length > 0) {
        playAchievementSound();
      }

      return newlyUnlocked
        .map(
          (id) => achievementDetails[id]
        )
        .filter(Boolean);
    } catch (error) {
      console.log(
        'Error checking achievements:',
        error
      );

      return [];
    }
  };

  const calculateXP = (
    finalScore: number,
    finalBestStreak: number
  ) => {
    let xp = finalScore * 20;

    if (finalBestStreak >= 3) {
      xp += 25;
    }

    if (finalScore === questions.length) {
      xp += 50;
    }

    return xp;
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const saveGameStats = async (
    finalScore: number,
    finalBestStreak: number
  ) => {
    try {
      const existing = await AsyncStorage.multiGet([
        'bestScore',
        'bestStreak',
        'gamesPlayed',
        'playerXP',
      ]);

      const bestScore =
        Number(existing[0][1] || 0);

      const storedBestStreak =
        Number(existing[1][1] || 0);

      const gamesPlayed =
        Number(existing[2][1] || 0);

      const currentXP =
        Number(existing[3][1] || 0);

      const earnedXP = calculateXP(
        finalScore,
        finalBestStreak
      );

      const newXP = currentXP + earnedXP;

      const oldLevel = calculateLevel(currentXP);
      const newLevel = calculateLevel(newXP);

      if (newLevel > oldLevel) {
        await AsyncStorage.setItem(
          'levelUp',
          String(newLevel)
        );
      }

      await AsyncStorage.multiSet([
        [
          'bestScore',
          String(
            Math.max(bestScore, finalScore)
          ),
        ],
        [
          'bestStreak',
          String(
            Math.max(
              storedBestStreak,
              finalBestStreak
            )
          ),
        ],
        [
          'gamesPlayed',
          String(gamesPlayed + 1),
        ],
        [
          'playerXP',
          String(newXP),
        ],
      ]);
    } catch (error) {
      console.log(
        'Error saving stats:',
        error
      );
    }
  };

  const saveLeaderboardScore = async (
    finalScore: number
  ) => {
    try {
      const playerName =
        (await AsyncStorage.getItem(
          'playerName'
        )) || 'You';

      const existing =
        await AsyncStorage.getItem(
          'leaderboard'
        );

      const leaderboard = existing
        ? JSON.parse(existing)
        : [];

      leaderboard.push({
        name: playerName,
        score: finalScore,
      });

      leaderboard.sort(
        (
          a: { score: number },
          b: { score: number }
        ) => b.score - a.score
      );

      await AsyncStorage.setItem(
        'leaderboard',
        JSON.stringify(
          leaderboard.slice(0, 10)
        )
      );
    } catch (error) {
      console.log(
        'Error saving leaderboard:',
        error
      );
    }
  };

  const finishGame = async (
    finalScore: number,
    finalBestStreak: number,
    finalReview: ReviewItem[]
  ) => {
    setSoundEffect('complete');

    setTimeout(() => {
      setSoundEffect(null);
    }, 500);

    await saveGameStats(
  finalScore,
  finalBestStreak
);

const savedScoreHistory =
  await AsyncStorage.getItem('scoreHistory');

const scoreHistory: number[] =
  savedScoreHistory
    ? JSON.parse(savedScoreHistory)
    : [];

scoreHistory.push(finalScore);

await AsyncStorage.setItem(
  'scoreHistory',
  JSON.stringify(scoreHistory)
);

const categoryHistoryKey =
  `categoryHistory_${selectedCategory}`;

const savedCategoryHistory =
  await AsyncStorage.getItem(
    categoryHistoryKey
  );

const categoryHistory: number[] =
  savedCategoryHistory
    ? JSON.parse(savedCategoryHistory)
    : [];

categoryHistory.push(finalScore);

await AsyncStorage.setItem(
  categoryHistoryKey,
  JSON.stringify(categoryHistory)
);

    const unlocked =
      await checkAchievements(
        finalScore,
        finalBestStreak
      );

    if (unlocked.length > 0) {
      setNewAchievements(unlocked);

      setPendingResult({
        score: finalScore,
        streak: finalBestStreak,
      });

      setShowAchievementPopup(true);
      return;
    }

    router.replace({
      pathname: '/results',
      params: {
        score: String(finalScore),
        streak: String(finalBestStreak),
        category: categoryName,
      },
    });
  };

  const nextQuestion = (
    newScore: number,
    newBestStreak: number,
    finalReview?: ReviewItem[]
  ) => {
    if (
      currentQuestion ===
      questions.length - 1
    ) {
      finishGame(
        newScore,
        newBestStreak,
        finalReview || reviewAnswers
      );

      return;
    }

    setCurrentQuestion(
      (previous) => previous + 1
    );

    setSelected(null);
    setShowExplanation(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const handleAnswer = (
    answer: string
  ) => {
    if (selected) return;

    setSelected(answer);
    setShowExplanation(true);

    const newReviewItem: ReviewItem = {
      question: question.question,
      selectedAnswer: answer,
      correctAnswer: question.answer,
      explanation: question.explanation,
    };

    setReviewAnswers(
      (previous) => [
        ...previous,
        newReviewItem,
      ]
    );

    const correct =
  answer === question.answer;

setSoundEffect(
  correct ? 'correct' : 'wrong'
);

setHapticEffect(
  correct ? 'correct' : 'wrong'
);

setTimeout(() => {
  setSoundEffect(null);
}, 500);

setTimeout(() => {
  setHapticEffect(null);
}, 500);

if (correct) {
  const newScore = score + 1;
  const newStreak = streak + 1;

      if (newStreak >= 3) {
  setSoundEffect('streak');
  setHapticEffect('streak');

  setTimeout(() => {
    setSoundEffect(null);
  }, 500);

  setTimeout(() => {
    setHapticEffect(null);
  }, 500);
}

      const newBestStreak = Math.max(
        bestStreak,
        newStreak
      );

      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(newBestStreak);

      if (
        currentQuestion ===
        questions.length - 1
      ) {
        setPendingResult({
          score: newScore,
          streak: newBestStreak,
        });
      }
    } else {
      setStreak(0);

      if (
        currentQuestion ===
        questions.length - 1
      ) {
        setPendingResult({
          score,
          streak: bestStreak,
        });
      }
    }
  };

  const handleNext = () => {
    if (
      currentQuestion ===
      questions.length - 1
    ) {
      nextQuestion(
        pendingResult?.score ?? score,
        pendingResult?.streak ?? bestStreak,
        reviewAnswers
      );

      return;
    }

    nextQuestion(
      score,
      bestStreak,
      reviewAnswers
    );
  };

  const handleTimeUp = () => {
    if (selected) return;

    setSelected('TIME_UP');
    setShowExplanation(true);
    setStreak(0);

    const newReviewItem: ReviewItem = {
      question: question.question,
      selectedAnswer: 'Time Up',
      correctAnswer: question.answer,
      explanation: question.explanation,
    };

    setReviewAnswers(
      (previous) => [
        ...previous,
        newReviewItem,
      ]
    );

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      setPendingResult({
        score,
        streak: bestStreak,
      });
    }
  };

  const continueAfterAchievement = () => {
    setShowAchievementPopup(false);

    router.replace({
      pathname: '/results',
      params: {
        score: String(
          pendingResult?.score ?? score
        ),
        streak: String(
          pendingResult?.streak ?? bestStreak
        ),
        category: categoryName,
      },
    });
  };

  useEffect(() => {
    if (selected) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft, selected]);

  if (!questionsReady || !question) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Preparing your questions...
        </Text>
      </View>
    );
  }


  const answeredCorrectly =
    selected === question.answer;

  const timerIsLow = timeLeft <= 5;

  return (
  <View style={styles.container}>
    <GameSounds sound={soundEffect} />

<HapticsManager type={hapticEffect} />

<BackgroundMusic playing={true} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <View style={styles.categoryBadge}>
            <Text style={styles.category}>
              {categoryName}
            </Text>
          </View>

          <View
            style={[
              styles.timerBadge,
              timerIsLow && styles.timerBadgeLow,
            ]}
          >
            <Text
              style={[
                styles.timer,
                timerIsLow && styles.timerLow,
              ]}
            >
              ⏱ {timeLeft}s
            </Text>
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            QUESTION {currentQuestion + 1} OF {questions.length}
          </Text>

          <Text style={styles.progressPercent}>
            {Math.round(
              ((currentQuestion + 1) /
                questions.length) *
                100
            )}%
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View
  style={{
    width: `${((currentQuestion + 1) / questions.length) * 100}%` as `${number}%`,
  }}
/>
        </View>

        {/* STATS */}
        <View style={styles.miniStats}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatIcon}>🎯</Text>
            <View>
              <Text style={styles.miniStatLabel}>
                SCORE
              </Text>
              <Text style={styles.miniStatValue}>
                {score}
              </Text>
            </View>
          </View>

          <View style={styles.miniStat}>
            <Text style={styles.miniStatIcon}>🔥</Text>
            <View>
              <Text style={styles.miniStatLabel}>
                STREAK
              </Text>
              <Text style={styles.miniStatValue}>
                {streak}
              </Text>
            </View>
          </View>
        </View>

        {/* QUESTION CARD */}
        <View style={styles.questionCard}>
          <View style={styles.questionIcon}>
            <Text style={styles.questionIconText}>
              ?
            </Text>
          </View>

          <Text style={styles.question}>
            {question.question}
          </Text>
        </View>

        {/* OPTIONS */}
        <Text style={styles.answerLabel}>
          CHOOSE YOUR ANSWER
        </Text>

        <View style={styles.options}>
          {question.options.map(
            (option, index) => {
              const isSelected =
                selected === option;

              const isCorrect =
  selected === question.answer;


              const isWrong =
                isSelected &&
                option !== question.answer;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    isSelected &&
                      styles.selectedOption,
                    isCorrect &&
                      styles.correctOption,
                    isWrong &&
                      styles.wrongOption,
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleAnswer(option)
                  }
                  disabled={!!selected}
                >
                  <View
                    style={[
                      styles.optionNumber,
                      isCorrect &&
                        styles.optionNumberCorrect,
                      isWrong &&
                        styles.optionNumberWrong,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionNumberText,
                        isCorrect &&
                          styles.optionNumberTextActive,
                        isWrong &&
                          styles.optionNumberTextActive,
                      ]}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </Text>
                  </View>

                  <Text style={styles.optionText}>
                    {option}
                  </Text>

                  {isCorrect && (
                    <Text style={styles.answerIcon}>
                      ✓
                    </Text>
                  )}

                  {isWrong && (
                    <Text style={styles.answerIconWrong}>
                      ✕
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* EXPLANATION */}
        {showExplanation && (
          <View
            style={[
              styles.explanationBox,
              answeredCorrectly
                ? styles.correctBox
                : styles.wrongBox,
            ]}
          >
            <View style={styles.feedbackHeader}>
              <Text style={styles.feedbackTitle}>
                {selected === 'TIME_UP'
                  ? '⏰ Time Up!'
                  : answeredCorrectly
                  ? '✅ Correct!'
                  : '❌ Incorrect'}
              </Text>

              {answeredCorrectly && (
                <Text style={styles.feedbackXP}>
                  +20 XP
                </Text>
              )}
            </View>

            {!answeredCorrectly && (
              <View style={styles.correctAnswerBox}>
                <Text style={styles.correctAnswerLabel}>
                  CORRECT ANSWER
                </Text>
                <Text style={styles.correctAnswer}>
                  {question.answer}
                </Text>
              </View>
            )}

            <View style={styles.explanationDivider} />

            <Text style={styles.explanationLabel}>
              💡 EXPLANATION
            </Text>

            <Text style={styles.explanation}>
              {question.explanation}
            </Text>

            <TouchableOpacity
              style={styles.nextButton}
              activeOpacity={0.8}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion ===
                questions.length - 1
                  ? 'VIEW RESULTS'
                  : 'NEXT QUESTION'}
              </Text>

              <Text style={styles.nextArrow}>
                →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* ACHIEVEMENT POPUP */}
      {showAchievementPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupTopCircle}>
              <Text style={styles.popupEmoji}>
                🎉
              </Text>
            </View>

            <Text style={styles.popupTitle}>
              ACHIEVEMENT UNLOCKED!
            </Text>

            <Text style={styles.popupSubtitle}>
              Great job! You earned a new badge.
            </Text>

            {newAchievements.map(
              (achievement) => (
                <View
                  key={achievement.id}
                  style={styles.achievementItem}
                >
                  <View
                    style={styles.achievementIcon}
                  >
                    <Text
                      style={
                        styles.achievementEmoji
                      }
                    >
                      {achievement.emoji}
                    </Text>
                  </View>

                  <View
                    style={styles.achievementInfo}
                  >
                    <Text
                      style={
                        styles.achievementTitle
                      }
                    >
                      {achievement.title}
                    </Text>

                    <Text
                      style={
                        styles.achievementDescription
                      }
                    >
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              )
            )}

            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={
                continueAfterAchievement
              }
            >
              <Text
                style={styles.continueButtonText}
              >
                CONTINUE
              </Text>

              <Text style={styles.continueArrow}>
                →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
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

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#111D2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  back: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 30,
    marginTop: -3,
  },

  categoryBadge: {
    backgroundColor: '#172554',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1E40AF',
  },

  category: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '900',
  },

  timerBadge: {
    backgroundColor: '#172554',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1E40AF',
  },

  timerBadgeLow: {
    backgroundColor: '#451A1A',
    borderColor: '#EF4444',
  },

  timer: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '900',
  },

  timerLow: {
    color: '#F87171',
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 8,
  },

  progressLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  progressPercent: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '900',
  },

  progressContainer: {
    height: 8,
    backgroundColor: '#111D2E',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },

  miniStat: {
    width: '48%',
    backgroundColor: '#111D2E',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  miniStatIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  miniStatLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  miniStatValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },

  questionCard: {
    backgroundColor: '#111D2E',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },

  questionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  questionIconText: {
    color: '#60A5FA',
    fontSize: 23,
    fontWeight: '900',
  },

  question: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 31,
  },

  answerLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 10,
  },

  options: {
    gap: 10,
  },

  option: {
    minHeight: 62,
    backgroundColor: '#111D2E',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedOption: {
    borderColor: '#60A5FA',
    backgroundColor: '#172554',
  },

  correctOption: {
    borderColor: '#22C55E',
    backgroundColor: '#123B29',
  },

  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: '#3A171B',
  },

  optionNumber: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  optionNumberCorrect: {
    backgroundColor: '#166534',
  },

  optionNumberWrong: {
    backgroundColor: '#991B1B',
  },

  optionNumberText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '900',
  },

  optionNumberTextActive: {
    color: '#FFFFFF',
  },

  optionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  answerIcon: {
    color: '#4ADE80',
    fontSize: 23,
    fontWeight: '900',
    marginLeft: 8,
  },

  answerIconWrong: {
    color: '#F87171',
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 8,
  },

  explanationBox: {
    marginTop: 18,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
  },

  correctBox: {
    backgroundColor: '#123B29',
    borderColor: '#22C55E',
  },

  wrongBox: {
    backgroundColor: '#3A171B',
    borderColor: '#EF4444',
  },

  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  feedbackXP: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '900',
  },

  correctAnswerBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    padding: 11,
    marginTop: 12,
  },

  correctAnswerLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  correctAnswer: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  explanationDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: 13,
  },

  explanationLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 12,
  },

  explanation: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  nextButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  nextArrow: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 8,
  },

  footerSpace: {
    height: 20,
  },

  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },

  popupCard: {
    width: '100%',
    backgroundColor: '#111D2E',
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  popupTopCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  popupEmoji: {
    fontSize: 38,
  },

  popupTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  popupSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 17,
  },

  achievementItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172554',
    borderRadius: 16,
    padding: 13,
    marginBottom: 9,
  },

  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  achievementEmoji: {
    fontSize: 27,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  achievementDescription: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  continueButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  continueArrow: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 8,
  },

  loadingContainer: {
  flex: 1,
  backgroundColor: '#0F172A',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
},

loadingText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},
});