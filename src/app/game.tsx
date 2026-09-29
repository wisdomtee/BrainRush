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

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

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

type CategoryKey =
  | 'general'
  | 'technology'
  | 'science'
  | 'math'
  | 'history'
  | 'sports';

const questionBanks: Record<CategoryKey, Question[]> = {
  general: [
    {
      question: 'What is the capital of Nigeria?',
      options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
      answer: 'Abuja',
      explanation:
        'Abuja became Nigeria’s capital in 1991, replacing Lagos.',
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      answer: 'Mars',
      explanation:
        'Mars appears reddish because iron minerals on its surface have oxidized.',
    },
    {
      question: 'How many continents are there?',
      options: ['5', '6', '7', '8'],
      answer: '7',
      explanation:
        'The seven continents are Africa, Antarctica, Asia, Europe, North America, South America, and Australia.',
    },
    {
      question: 'Which language is mainly used to build React apps?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      answer: 'JavaScript',
      explanation:
        'React is a JavaScript library commonly used to build user interfaces.',
    },
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Text Machine Language',
        'Hyper Transfer Markup Language',
        'Home Tool Markup Language',
      ],
      answer: 'Hyper Text Markup Language',
      explanation:
        'HTML is the standard markup language used to structure web pages.',
    },
  ],

  technology: [
    {
      question: 'What does CPU stand for?',
      options: [
        'Central Processing Unit',
        'Computer Personal Unit',
        'Central Program Utility',
        'Computer Processing Utility',
      ],
      answer: 'Central Processing Unit',
      explanation:
        'The CPU executes instructions and performs calculations for a computer.',
    },
    {
      question: 'Which language is used with React Native?',
      options: ['JavaScript', 'SQL', 'PHP', 'Ruby'],
      answer: 'JavaScript',
      explanation:
        'React Native uses JavaScript or TypeScript to build cross-platform applications.',
    },
    {
      question: 'What does API stand for?',
      options: [
        'Application Programming Interface',
        'Advanced Program Internet',
        'Application Process Integration',
        'Automated Programming Interface',
      ],
      answer: 'Application Programming Interface',
      explanation:
        'An API defines how different software systems can communicate with each other.',
    },
    {
      question: 'Which company created Android?',
      options: ['Apple', 'Google', 'Microsoft', 'IBM'],
      answer: 'Google',
      explanation:
        'Google acquired Android Inc. in 2005 and has continued developing the Android platform.',
    },
    {
      question: 'What does HTML describe?',
      options: [
        'Web page structure',
        'Database queries',
        'Computer hardware',
        'Network security',
      ],
      answer: 'Web page structure',
      explanation:
        'HTML provides the structure and content of a web page.',
    },
  ],

  science: [
    {
      question: 'What gas do humans need to breathe?',
      options: ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Nitrogen'],
      answer: 'Oxygen',
      explanation:
        'Humans use oxygen during cellular respiration to help release energy from food.',
    },
    {
      question: 'What is the center of an atom called?',
      options: ['Electron', 'Nucleus', 'Proton', 'Molecule'],
      answer: 'Nucleus',
      explanation:
        'The nucleus is the dense central part of an atom containing protons and neutrons.',
    },
    {
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Earth', 'Mercury', 'Mars'],
      answer: 'Mercury',
      explanation:
        'Mercury is the innermost planet in our Solar System.',
    },
    {
      question: 'What force keeps us on the ground?',
      options: ['Magnetism', 'Gravity', 'Friction', 'Electricity'],
      answer: 'Gravity',
      explanation:
        'Earth’s gravity pulls objects toward its center.',
    },
    {
      question: 'What is H2O commonly called?',
      options: ['Salt', 'Oxygen', 'Water', 'Hydrogen'],
      answer: 'Water',
      explanation:
        'H2O is the chemical formula for water, made of two hydrogen atoms and one oxygen atom.',
    },
  ],

  math: [
    {
      question: 'What is 12 × 8?',
      options: ['86', '96', '108', '88'],
      answer: '96',
      explanation: '12 multiplied by 8 equals 96.',
    },
    {
      question: 'What is 100 ÷ 10?',
      options: ['5', '10', '20', '25'],
      answer: '10',
      explanation:
        'Dividing 100 into 10 equal groups gives 10 in each group.',
    },
    {
      question: 'What is 15 + 27?',
      options: ['32', '40', '42', '45'],
      answer: '42',
      explanation: '15 plus 27 equals 42.',
    },
    {
      question: 'What is 9 × 9?',
      options: ['72', '81', '90', '99'],
      answer: '81',
      explanation: '9 multiplied by 9 equals 81.',
    },
    {
      question: 'What is 50% of 200?',
      options: ['50', '75', '100', '150'],
      answer: '100',
      explanation:
        '50% means one-half, and half of 200 is 100.',
    },
  ],

  history: [
    {
      question: 'Who was the first President of Nigeria?',
      options: [
        'Nnamdi Azikiwe',
        'Olusegun Obasanjo',
        'Abraham Lincoln',
        'Nelson Mandela',
      ],
      answer: 'Nnamdi Azikiwe',
      explanation:
        'Nnamdi Azikiwe became Nigeria’s first President in 1963.',
    },
    {
      question:
        'Which ancient civilization built the pyramids of Giza?',
      options: ['Romans', 'Egyptians', 'Greeks', 'Mayans'],
      answer: 'Egyptians',
      explanation:
        'The pyramids of Giza were built in ancient Egypt.',
    },
    {
      question: 'Who discovered penicillin?',
      options: [
        'Alexander Fleming',
        'Isaac Newton',
        'Albert Einstein',
        'Louis Pasteur',
      ],
      answer: 'Alexander Fleming',
      explanation:
        'Alexander Fleming discovered penicillin in 1928.',
    },
    {
      question: 'In which country did the Olympic Games originate?',
      options: ['Italy', 'Greece', 'France', 'Egypt'],
      answer: 'Greece',
      explanation:
        'The ancient Olympic Games originated in ancient Greece.',
    },
    {
      question: 'Who was known as the Maid of Orléans?',
      options: [
        'Cleopatra',
        'Joan of Arc',
        'Marie Curie',
        'Queen Victoria',
      ],
      answer: 'Joan of Arc',
      explanation:
        'Joan of Arc was a French historical figure associated with the siege of Orléans during the Hundred Years’ War.',
    },
  ],

  sports: [
    {
      question:
        'How many players are on a football team on the field?',
      options: ['9', '10', '11', '12'],
      answer: '11',
      explanation:
        'A football team has 11 players on the field during normal play.',
    },
    {
      question:
        'Which sport uses a racket and shuttlecock?',
      options: [
        'Tennis',
        'Badminton',
        'Basketball',
        'Cricket',
      ],
      answer: 'Badminton',
      explanation:
        'Badminton is played using rackets and a shuttlecock.',
    },
    {
      question: 'How many rings are on the Olympic flag?',
      options: ['4', '5', '6', '7'],
      answer: '5',
      explanation:
        'The Olympic symbol contains five interlocking rings.',
    },
    {
      question: 'Which sport is played at Wimbledon?',
      options: ['Football', 'Tennis', 'Golf', 'Rugby'],
      answer: 'Tennis',
      explanation:
        'Wimbledon is one of tennis’s four Grand Slam tournaments.',
    },
    {
      question: 'How long is a standard football match?',
      options: [
        '60 minutes',
        '75 minutes',
        '90 minutes',
        '120 minutes',
      ],
      answer: '90 minutes',
      explanation:
        'A standard football match consists of two 45-minute halves.',
    },
  ],
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
    title: 'Knowledge Seeker',
    description: 'You completed all 6 categories!',
    emoji: '📚',
  },
  quiz_veteran: {
    id: 'quiz_veteran',
    title: 'Quiz Veteran',
    description: 'You completed 10 quizzes!',
    emoji: '🏆',
  },
};

const TIME_PER_QUESTION = 15;

export default function GameScreen() {
  const { category } = useLocalSearchParams<{
    category?: string;
  }>();

  const selectedCategory =
    (category as CategoryKey) || 'general';

  const questions =
    questionBanks[selectedCategory] ||
    questionBanks.general;

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

      if (playedCategories.length >= 6) {
        unlockIfNew('knowledge_seeker');
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
    await saveGameStats(
      finalScore,
      finalBestStreak
    );

    await saveLeaderboardScore(
      finalScore
    );

    await AsyncStorage.setItem(
      'lastQuizReview',
      JSON.stringify(finalReview)
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

    if (correct) {
      const newScore = score + 1;
      const newStreak = streak + 1;

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

  const answeredCorrectly =
    selected === question.answer;

  const timerIsLow = timeLeft <= 5;

  return (
    <View style={styles.container}>
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
            style={[
              styles.progress,
              {
                width:
                  (
                    ((currentQuestion + 1) /
                      questions.length) *
                    100
                  ) + '%',
              },
            ]}
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
                !!selected &&
                option === question.answer;

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
});