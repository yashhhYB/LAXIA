import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Share, Volume2, RotateCcw } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Statement {
  text: string;
  isReal: boolean;
  explanation: string;
}

const statements: Statement[] = [
  {
    text: "You can legally marry your WiFi router in Uttar Pradesh",
    isReal: false,
    explanation: "This is completely fake! Marriage laws in India require both parties to be human beings. WiFi routers cannot enter into legal contracts."
  },
  {
    text: "IPC 302 is punishment for murder",
    isReal: true,
    explanation: "Correct! Section 302 of the Indian Penal Code deals with punishment for murder, which can be death penalty or life imprisonment."
  },
  {
    text: "In Kerala, cows must be registered as temporary citizens",
    isReal: false,
    explanation: "This is fake! While Kerala has strong animal protection laws, cows are not registered as citizens. Only humans can be citizens."
  },
  {
    text: "Section 498A covers cruelty by husband",
    isReal: true,
    explanation: "Correct! Section 498A of the IPC deals with cruelty by husband or relatives of husband towards a married woman."
  },
  {
    text: "You can legally adopt a pet rock as your child in Mumbai",
    isReal: false,
    explanation: "This is fake! Adoption laws in India require the adoptee to be a human child. Pet rocks cannot be legally adopted as children."
  },
  {
    text: "Article 21 guarantees Right to Life and Personal Liberty",
    isReal: true,
    explanation: "Correct! Article 21 of the Indian Constitution is a fundamental right that guarantees protection of life and personal liberty."
  },
  {
    text: "In Goa, you must sing the national anthem before eating fish curry",
    isReal: false,
    explanation: "This is completely fake! There are no laws in Goa requiring singing the national anthem before eating any food."
  },
  {
    text: "Consumer Protection Act allows complaints within 2 years",
    isReal: true,
    explanation: "Correct! Under the Consumer Protection Act, consumers can file complaints within 2 years from the date of cause of action."
  }
];

export default function LawOrLolGame() {
  const [currentStatement, setCurrentStatement] = useState<Statement>(statements[0]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const cardShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Get random statement on mount
    getRandomStatement();
  }, []);

  const getRandomStatement = () => {
    const randomIndex = Math.floor(Math.random() * statements.length);
    setCurrentStatement(statements[randomIndex]);
    setShowResult(false);
  };

  const handleAnswer = async (userAnswer: boolean) => {
    if (showResult) return;

    const correct = userAnswer === currentStatement.isReal;
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({ 
      correct: prev.correct + (correct ? 1 : 0), 
      total: prev.total + 1 
    }));

    if (!gameStarted) {
      setGameStarted(true);
    }

    // Trigger animations
    if (correct) {
      // Success animation
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Shake animation for wrong answer
      Animated.sequence([
        Animated.timing(cardShakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(cardShakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(cardShakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(cardShakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }

    // Play voice response
    await playVoiceResponse(correct);
  };

  const playVoiceResponse = async (correct: boolean) => {
    if (Platform.OS === 'web') {
      try {
        const message = correct 
          ? "Correct! You know your laws well!" 
          : "Wrong! Meme arrested! Better study those law books!";
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 1.1;
          utterance.pitch = correct ? 1.2 : 0.8;
          utterance.volume = 0.8;
          
          // Use a more dramatic voice for wrong answers
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices.find(voice => 
              voice.name.includes('Google') || voice.name.includes('Microsoft')
            ) || voices[0];
          }
          
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error('Voice synthesis error:', error);
      }
    } else {
      // For mobile, show alert with sound effect simulation
      Alert.alert(
        correct ? "🎉 Correct!" : "❌ Wrong!",
        correct 
          ? "You know your laws well!" 
          : "Meme arrested! Better study those law books!",
        [{ text: "OK" }]
      );
    }
  };

  const handleNextQuestion = () => {
    getRandomStatement();
    
    // Reset animations
    sparkleAnim.setValue(0);
    cardShakeAnim.setValue(0);
  };

  const handleShare = () => {
    const shareText = `🤡 Law or LOL Challenge!\n\n"${currentStatement.text}"\n\nWhat do you think - Real law or fake? 🤔\n\nPlay LAXIA Legal Game!`;
    
    if (Platform.OS === 'web') {
      if (navigator.share) {
        navigator.share({
          title: 'Law or LOL Challenge',
          text: shareText,
          url: window.location.href,
        }).catch(console.error);
      } else {
        // Fallback for web browsers without native sharing
        navigator.clipboard.writeText(shareText).then(() => {
          Alert.alert('Copied!', 'Challenge copied to clipboard. Share it with friends!');
        }).catch(() => {
          Alert.alert('Share', shareText);
        });
      }
    } else {
      Alert.alert('Share to Reddit', 'This would post to r/LegalAdviceIndia subreddit!');
    }
  };

  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    setGameStarted(false);
    getRandomStatement();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Sparkle Animation Overlay */}
      <Animated.View 
        style={[
          styles.sparkleOverlay,
          {
            opacity: sparkleAnim,
            transform: [{ scale: sparkleAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <Sparkles size={40} color="#FFD700" />
        <Sparkles size={30} color="#40E0FF" />
        <Sparkles size={35} color="#10B981" />
      </Animated.View>

      <Text style={styles.sectionTitle}>Law or LOL 🤡</Text>
      
      {gameStarted && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame} activeOpacity={0.8}>
            <RotateCcw size={16} color="#40E0FF" />
          </TouchableOpacity>
        </View>
      )}

      <Animated.View 
        style={[
          styles.gameCard,
          {
            transform: [{ translateX: cardShakeAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Legal Statement Challenge</Text>
            <Text style={styles.cardSubtitle}>Real law or internet meme?</Text>
          </View>

          <View style={styles.statementContainer}>
            <Text style={styles.statement}>"{currentStatement.text}"</Text>
          </View>

          {!showResult ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => handleAnswer(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.answerButtonGradient}
                >
                  <Text style={styles.answerButtonText}>✅ It's Real</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => handleAnswer(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.answerButtonGradient}
                >
                  <Text style={styles.answerButtonText}>❌ It's Fake</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Animated.View style={styles.resultBanner}>
                <LinearGradient
                  colors={isCorrect ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                  style={styles.resultBannerGradient}
                >
                  <Text style={styles.resultText}>
                    {isCorrect ? "🎉 Correct!" : "❌ Wrong! Meme Arrested!"}
                  </Text>
                </LinearGradient>
              </Animated.View>

              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>💡 Explanation:</Text>
                <Text style={styles.explanationText}>{currentStatement.explanation}</Text>
              </View>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#40E0FF', '#1E40AF']}
                    style={styles.nextButtonGradient}
                  >
                    <Text style={styles.nextButtonText}>Next Challenge</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.shareButtonGradient}
                  >
                    <Share size={16} color="#FFFFFF" />
                    <Text style={styles.shareButtonText}>💬 Share</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  sparkleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  sectionTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#40E0FF',
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#40E0FF20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#40E0FF40',
  },
  gameCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  cardGradient: {
    padding: width < 380 ? 16 : 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  cardSubtitle: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  statementContainer: {
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: width < 380 ? 16 : 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  statement: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  answerButtonGradient: {
    paddingVertical: width < 380 ? 12 : 14,
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultBanner: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultBannerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  resultText: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  explanationContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  explanationTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#40E0FF',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shareButtonGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});