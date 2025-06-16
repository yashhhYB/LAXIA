import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export interface VoiceAgent {
  initialize(): Promise<boolean>;
  startListening(): Promise<boolean>;
  stopListening(): Promise<void>;
  speak(text: string): Promise<boolean>;
  stopSpeaking(): void;
  onVoiceInput?: (transcript: string) => void;
}

class WebVoiceAgent implements VoiceAgent {
  private recognition: any = null;
  private isListening: boolean = false;
  private synthesis: SpeechSynthesis | null = null;
  public onVoiceInput?: (transcript: string) => void;

  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input:', transcript);
          if (this.onVoiceInput) {
            this.onVoiceInput(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }

      // Initialize speech synthesis
      this.synthesis = window.speechSynthesis;

      return !!(this.recognition && this.synthesis);
    } catch (error) {
      console.error('Voice agent initialization failed:', error);
      return false;
    }
  }

  async startListening(): Promise<boolean> {
    try {
      if (!this.recognition || this.isListening) return false;

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      return false;
    }
  }

  async stopListening(): Promise<void> {
    try {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }

  async speak(text: string): Promise<boolean> {
    try {
      if (!this.synthesis) return false;

      // Clean the text for better speech
      const cleanText = text
        .replace(/[*#•]/g, '') // Remove markdown and bullet points
        .replace(/\n/g, '. ') // Replace newlines with pauses
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Try to use a good voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.synthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Failed to speak:', error);
      return false;
    }
  }

  stopSpeaking(): void {
    try {
      if (this.synthesis) {
        this.synthesis.cancel();
      }
    } catch (error) {
      console.error('Failed to stop speaking:', error);
    }
  }
}

class MobileVoiceAgent implements VoiceAgent {
  private isListening: boolean = false;
  public onVoiceInput?: (transcript: string) => void;

  async initialize(): Promise<boolean> {
    try {
      // Check if speech is available
      const available = await Speech.isSpeakingAsync();
      return true; // Speech is generally available on mobile
    } catch (error) {
      console.error('Mobile voice agent initialization failed:', error);
      return false;
    }
  }

  async startListening(): Promise<boolean> {
    try {
      // For mobile, we'll simulate voice input for now
      // In a real app, you'd use expo-speech-recognition or similar
      this.isListening = true;
      
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        if (this.isListening && this.onVoiceInput) {
          this.onVoiceInput("Tell me about traffic laws");
          this.isListening = false;
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error('Failed to start listening on mobile:', error);
      return false;
    }
  }

  async stopListening(): Promise<void> {
    this.isListening = false;
  }

  async speak(text: string): Promise<boolean> {
    try {
      // Clean the text for better speech
      const cleanText = text
        .replace(/[*#•⚖️🚦📋👩‍⚖️🛡️💻🤖]/g, '') // Remove emojis and markdown
        .replace(/\n/g, '. ') // Replace newlines with pauses
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .trim();

      await Speech.speak(cleanText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        quality: Speech.VoiceQuality.Enhanced,
      });

      return true;
    } catch (error) {
      console.error('Failed to speak on mobile:', error);
      return false;
    }
  }

  stopSpeaking(): void {
    try {
      Speech.stop();
    } catch (error) {
      console.error('Failed to stop speaking on mobile:', error);
    }
  }
}

// Singleton instance
let voiceAgentInstance: VoiceAgent | null = null;

export function getVoiceAgent(): VoiceAgent {
  if (!voiceAgentInstance) {
    if (Platform.OS === 'web') {
      voiceAgentInstance = new WebVoiceAgent();
    } else {
      voiceAgentInstance = new MobileVoiceAgent();
    }
  }
  return voiceAgentInstance;
}