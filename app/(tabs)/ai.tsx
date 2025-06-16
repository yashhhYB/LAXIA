import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Animated, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Send, Bot, MicOff, Sparkles, Zap, Scale, BookOpen, Volume2, VolumeX } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lawsAPI, newsAPI } from '@/lib/supabase';
import { getVoiceAgent } from '@/lib/voiceAgent';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'law' | 'news' | 'general';
}

export default function AIScreen() {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [legalContext, setLegalContext] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const [voiceAgentInitialized, setVoiceAgentInitialized] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const voiceAgentRef = useRef<any>(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    loadLegalContext();
    initializeVoiceAgent();
  }, []);

  useEffect(() => {
    if (isListening || isVoiceAgentActive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isListening, isVoiceAgentActive]);

  const initializeVoiceAgent = async () => {
    try {
      voiceAgentRef.current = getVoiceAgent();
      const initialized = await voiceAgentRef.current.initialize();
      setVoiceAgentInitialized(initialized);
      
      // Set up voice input callback
      voiceAgentRef.current.onVoiceInput = (transcript: string) => {
        setInputText(transcript);
        setIsListening(false);
        setIsVoiceAgentActive(false);
        
        // Auto-send the message
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };
    } catch (error) {
      console.error('Voice agent initialization failed:', error);
      setVoiceAgentInitialized(false);
    }
  };

  const loadLegalContext = async () => {
    try {
      // Try to load from database, fallback to sample data
      const sampleLaws = [
        { title: 'Right to Information Act', category: 'Constitutional Rights', description: 'Citizens right to access government information' },
        { title: 'Traffic Rules', category: 'Traffic Laws', description: 'Speed limits and road safety regulations' },
        { title: 'Consumer Protection', category: 'Consumer Rights', description: 'Protection against unfair trade practices' }
      ];
      setLegalContext(sampleLaws);
    } catch (error) {
      console.error('Error loading legal context:', error);
    }
  };

  const quickQuestions = [
    { text: "What are my rights during police arrest?", category: "Criminal Law", gradient: ['#EF4444', '#DC2626'] },
    { text: "Traffic rules for two-wheelers in India", category: "Traffic", gradient: ['#3B82F6', '#1E40AF'] },
    { text: "How to file an RTI application?", category: "Rights", gradient: ['#EC4899', '#DB2777'] },
    { text: "Domestic violence protection laws", category: "Women Rights", gradient: ['#F59E0B', '#D97706'] },
    { text: "Consumer protection for online shopping", category: "Consumer", gradient: ['#10B981', '#059669'] },
    { text: "Cybercrime reporting procedures", category: "Cyber Law", gradient: ['#8B5CF6', '#7C3AED'] }
  ];

  const toggleVoiceAgent = async () => {
    try {
      if (!voiceAgentInitialized || !voiceAgentRef.current) {
        Alert.alert(
          'Voice Agent Unavailable',
          'Voice features are not available. Please check microphone permissions and try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (isVoiceAgentActive) {
        // Stop voice agent
        await voiceAgentRef.current.stopListening();
        setIsVoiceAgentActive(false);
        setIsListening(false);
      } else {
        // Start voice agent
        setIsVoiceAgentActive(true);
        
        Alert.alert(
          "🎤 LAXIA Voice Agent",
          "Voice Agent activated! Ask me any legal question and I'll respond with voice. Tap the microphone to start speaking.",
          [
            { 
              text: "Start Talking", 
              style: "default",
              onPress: async () => {
                const started = await voiceAgentRef.current.startListening();
                if (started) {
                  setIsListening(true);
                } else {
                  setIsVoiceAgentActive(false);
                  Alert.alert('Error', 'Could not start voice recognition. Please try again.');
                }
              }
            },
            { 
              text: "Cancel", 
              style: "cancel", 
              onPress: () => setIsVoiceAgentActive(false) 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Voice agent error:', error);
      Alert.alert('Voice Agent Error', 'Unable to start voice agent. Please try again.');
      setIsVoiceAgentActive(false);
      setIsListening(false);
    }
  };

  const toggleListening = async () => {
    try {
      if (!voiceAgentInitialized || !voiceAgentRef.current) {
        Alert.alert(
          'Voice Recognition Unavailable',
          'Voice features require microphone permissions. Please enable microphone access in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (isListening) {
        await voiceAgentRef.current.stopListening();
        setIsListening(false);
      } else {
        const started = await voiceAgentRef.current.startListening();
        if (started) {
          setIsListening(true);
        } else {
          Alert.alert('Error', 'Could not start voice recognition. Please try again.');
        }
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      Alert.alert('Voice Error', 'Voice recognition failed. Please try again.');
      setIsListening(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      if (!voiceAgentRef.current) return;

      if (isSpeaking) {
        voiceAgentRef.current.stopSpeaking();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      const success = await voiceAgentRef.current.speak(text);
      
      if (!success) {
        Alert.alert('Speech Error', 'Unable to speak the response');
      }
      
      // Auto-stop speaking indicator after a reasonable time
      setTimeout(() => {
        setIsSpeaking(false);
      }, Math.min(text.length * 100, 30000)); // Estimate speaking time
      
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      Alert.alert('Speech Error', 'Unable to speak the response');
    }
  };

  const stopSpeaking = () => {
    if (voiceAgentRef.current) {
      voiceAgentRef.current.stopSpeaking();
    }
    setIsSpeaking(false);
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        type: response.type,
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        
        // Auto-speak the response if voice agent was used
        if (isVoiceAgentActive || isListening) {
          speakText(response.text);
        }
      }, 1500);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble accessing legal information right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIResponse = async (question: string): Promise<{ text: string; type: string }> => {
    const lowerQuestion = question.toLowerCase();
    
    // Enhanced AI responses with more comprehensive legal information
    if (lowerQuestion.includes('arrest') || lowerQuestion.includes('police') || lowerQuestion.includes('rights during')) {
      return {
        text: `Your Rights During Police Arrest:

Fundamental Rights:
• Right to Know: Police must inform you of the reason for arrest
• Right to Silence: You can remain silent and not answer questions
• Right to Lawyer: You can request legal representation immediately
• Right to Inform: You can inform family members or friends
• Right to Medical Exam: You can request medical examination
• 24-Hour Rule: Must be produced before magistrate within 24 hours

Important Procedures:
• Police must show arrest warrant except in cognizable offenses
• You cannot be tortured or subjected to custodial violence
• Right to bail in bailable offenses
• Right to free legal aid if you cannot afford a lawyer

Emergency Contacts:
• Legal Aid Helpline: 15100
• Police Control Room: 100
• Women Helpline: 1091

Remember: Stay calm, cooperate within legal bounds, and exercise your rights responsibly.`,
        type: 'law'
      };
    }

    if (lowerQuestion.includes('traffic') || lowerQuestion.includes('driving') || lowerQuestion.includes('vehicle')) {
      return {
        text: `Traffic Laws and Two-Wheeler Rules:

Essential Documents:
• Valid Driving License
• Registration Certificate
• Insurance Certificate
• Pollution Under Control Certificate

Safety Requirements:
• Helmet: Mandatory for rider and pillion with 1000 rupees fine
• Speed Limits: 25 to 40 kilometers per hour in cities, 60 kilometers per hour on highways
• No Mobile Phone: Strictly prohibited while driving with 5000 rupees fine

Key Traffic Rules:
• Follow traffic signals and road signs
• No riding without valid license with 5000 rupees fine
• No triple riding or overloading
• Maintain lane discipline
• Use indicators while turning

Recent Updates:
• Digital driving licenses accepted
• FASTag mandatory for toll payments
• Increased penalties for violations
• E-challan system for fines

Emergency Numbers:
• Traffic Police: 103
• Ambulance: 108`,
        type: 'law'
      };
    }

    if (lowerQuestion.includes('record') || lowerQuestion.includes('phone call') || lowerQuestion.includes('consent')) {
      return {
        text: `Phone Call Recording Laws:

Legal Status:
• Recording calls WITHOUT consent is ILLEGAL in India
• Both parties must be aware of recording
• Violates privacy laws under IT Act 2000

When Recording is Legal:
• With explicit consent from all parties
• Court-ordered surveillance
• Law enforcement with proper authorization
• Emergency situations with limited scope

Penalties for Illegal Recording:
• Up to 3 years imprisonment
• Fine up to 2 lakh rupees
• Civil liability for damages
• Criminal charges under IPC Section 354C

Best Practices:
• Always inform before recording
• Get written consent for important calls
• Use call recording apps that announce recording
• Respect privacy of others

Legal Alternatives:
• Written agreements
• Email confirmations
• Witness presence during important discussions`,
        type: 'law'
      };
    }

    // Default comprehensive response
    return {
      text: `LAXIA AI Legal Assistant

I'm here to help with legal questions! I can provide information about:

• Criminal Law - Rights, procedures, penalties
• Civil Law - Marriage, property, contracts  
• Traffic Laws - Rules, fines, procedures
• Women's Rights - Safety laws, protection acts
• Consumer Rights - Protection, complaints
• Constitutional Rights - Fundamental rights, duties
• Cyber Law - Online safety, cybercrime reporting

Popular Topics:
• Police arrest procedures and rights
• Traffic violations and penalties
• RTI application process
• Domestic violence protection
• Consumer complaint procedures
• Cybercrime reporting

Please ask me specific legal questions for detailed guidance. I can also speak my responses aloud for better accessibility.

Voice Agent Available: Use the voice button for hands-free interaction!

Emergency Contacts:
• Police: 100 | Women Helpline: 1091 | Legal Aid: 15100`,
      type: 'general'
    };
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text style={styles.title}>LAXIA AI Assistant</Text>
            <Text style={styles.subtitle}>Your intelligent legal advisor with voice support</Text>
          </View>
          <View style={styles.aiIndicator}>
            <LinearGradient
              colors={isVoiceAgentActive ? ['#10B981', '#059669'] : ['#40E0FF', '#8B5CF6']}
              style={styles.aiIndicatorGradient}
            >
              <Scale size={14} color="#FFFFFF" />
              <Text style={styles.aiText}>{isVoiceAgentActive ? 'VOICE' : 'AI'}</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AI Avatar */}
          {messages.length === 0 && (
            <Animated.View 
              style={[
                styles.avatarContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={isVoiceAgentActive ? ['#10B981', '#059669'] : ['#40E0FF', '#8B5CF6']}
                style={styles.avatar}
              >
                <Bot size={width < 380 ? 32 : 36} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.avatarText}>
                {isVoiceAgentActive ? 'Voice Agent Active - Listening...' : 
                 isListening ? 'Listening...' : 
                 isTyping ? 'Analyzing legal database...' : 
                 'How can I help you with legal matters today?'}
              </Text>
              <Text style={styles.avatarSubtext}>
                Ask me anything about laws, rights, or legal procedures. I can speak my responses too!
              </Text>
            </Animated.View>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <View style={styles.chatContainer}>
              {messages.map((message) => (
                <Animated.View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  {!message.isUser && (
                    <LinearGradient
                      colors={message.type === 'law' ? ['#10B981', '#059669'] : ['#40E0FF', '#8B5CF6']}
                      style={styles.aiAvatar}
                    >
                      {message.type === 'law' ? (
                        <Scale size={14} color="#FFFFFF" />
                      ) : (
                        <Bot size={14} color="#FFFFFF" />
                      )}
                    </LinearGradient>
                  )}
                  <View style={[
                    styles.messageContent,
                    message.isUser ? styles.userMessageContent : styles.aiMessageContent,
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.aiMessageText,
                    ]}>
                      {message.text}
                    </Text>
                    <View style={styles.messageFooter}>
                      <Text style={styles.timestamp}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {!message.isUser && voiceAgentInitialized && (
                        <TouchableOpacity
                          style={styles.speakButton}
                          onPress={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                          activeOpacity={0.7}
                        >
                          {isSpeaking ? (
                            <VolumeX size={12} color="#40E0FF" />
                          ) : (
                            <Volume2 size={12} color="#40E0FF" />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Animated.View>
              ))}
              {isTyping && (
                <View style={[styles.messageContainer, styles.aiMessage]}>
                  <LinearGradient
                    colors={['#40E0FF', '#8B5CF6']}
                    style={styles.aiAvatar}
                  >
                    <Bot size={14} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.typingContainer}>
                    <Text style={styles.typingIndicator}>LAXIA is analyzing legal database...</Text>
                    <View style={styles.typingDots}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Quick Questions */}
          {messages.length === 0 && (
            <Animated.View 
              style={[
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <Text style={styles.sectionTitle}>Popular Legal Questions</Text>
              <View style={styles.quickQuestionsContainer}>
                {quickQuestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.questionButton}
                    onPress={() => handleQuickQuestion(item.text)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#1F2937', '#111827']}
                      style={styles.questionGradient}
                    >
                      <View style={styles.questionHeader}>
                        <LinearGradient
                          colors={item.gradient}
                          style={styles.categoryBadge}
                        >
                          <Text style={styles.questionCategory}>{item.category}</Text>
                        </LinearGradient>
                      </View>
                      <Text style={styles.questionText}>{item.text}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Section */}
        <Animated.View 
          style={[
            styles.inputSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.voiceButton]}
            onPress={toggleListening}
            activeOpacity={0.8}
            disabled={!voiceAgentInitialized}
          >
            <Animated.View style={{ transform: [{ scale: isListening ? pulseAnim : 1 }] }}>
              <LinearGradient
                colors={isListening ? ['#EF4444', '#DC2626'] : voiceAgentInitialized ? ['#40E0FF', '#1E40AF'] : ['#6B7280', '#4B5563']}
                style={styles.voiceButtonGradient}
              >
                {isListening ? (
                  <MicOff size={18} color="#FFFFFF" />
                ) : (
                  <Mic size={18} color="#FFFFFF" />
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Voice Agent Button */}
          <TouchableOpacity
            style={[styles.voiceAgentButton]}
            onPress={toggleVoiceAgent}
            activeOpacity={0.8}
            disabled={!voiceAgentInitialized}
          >
            <Animated.View style={{ transform: [{ scale: isVoiceAgentActive ? pulseAnim : 1 }] }}>
              <LinearGradient
                colors={isVoiceAgentActive ? ['#10B981', '#059669'] : voiceAgentInitialized ? ['#8B5CF6', '#7C3AED'] : ['#6B7280', '#4B5563']}
                style={styles.voiceAgentButtonGradient}
              >
                <Sparkles size={18} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask about laws, rights, or legal procedures..."
              placeholderTextColor="#6B7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => handleSendMessage()}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={inputText.trim() ? ['#40E0FF', '#1E40AF'] : ['#374151', '#1F2937']}
                style={styles.sendButtonGradient}
              >
                <Send size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: width < 380 ? 16 : 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: width < 380 ? 22 : 24,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  aiIndicator: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  aiIndicatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  aiText: {
    fontSize: 11,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width < 380 ? 16 : 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: width < 380 ? 80 : 90,
    height: width < 380 ? 80 : 90,
    borderRadius: width < 380 ? 40 : 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  avatarText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    marginBottom: 8,
  },
  avatarSubtext: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  chatContainer: {
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageContent: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
  },
  userMessageContent: {
    backgroundColor: '#1F2937',
    borderColor: '#40E0FF',
    marginLeft: 'auto',
  },
  aiMessageContent: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  messageText: {
    fontSize: width < 380 ? 13 : 14,
    fontFamily: 'Rajdhani-Medium',
    lineHeight: 18,
    marginBottom: 6,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 9,
    fontFamily: 'Rajdhani-Regular',
    color: '#6B7280',
  },
  speakButton: {
    padding: 3,
    borderRadius: 6,
    backgroundColor: '#40E0FF20',
  },
  typingContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typingIndicator: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#40E0FF',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#40E0FF',
    marginHorizontal: 1.5,
  },
  sectionTitle: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 14,
    marginTop: 16,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  quickQuestionsContainer: {
    marginBottom: 25,
  },
  questionButton: {
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  questionGradient: {
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  questionHeader: {
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  questionCategory: {
    fontSize: 9,
    fontFamily: 'Rajdhani-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    lineHeight: 20,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: width < 380 ? 16 : 20,
    paddingVertical: 14,
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  voiceButton: {
    marginRight: 8,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceAgentButton: {
    marginRight: 10,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceAgentButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#374151',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Rajdhani-Medium',
    fontSize: width < 380 ? 14 : 16,
    maxHeight: 70,
    minHeight: 18,
  },
  sendButton: {
    marginLeft: 6,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});