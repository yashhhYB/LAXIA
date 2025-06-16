export interface Database {
  public: {
    Tables: {
      laws: {
        Row: {
          id: string;
          title: string;
          description: string;
          content: string;
          category: string;
          location: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          created_at: string;
          updated_at: string;
          tags: string[];
          source: string;
          effective_date: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          content: string;
          category: string;
          location: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
          updated_at?: string;
          tags: string[];
          source: string;
          effective_date: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content?: string;
          category?: string;
          location?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
          updated_at?: string;
          tags?: string[];
          source?: string;
          effective_date?: string;
        };
      };
      legal_zones: {
        Row: {
          id: string;
          name: string;
          location: string;
          latitude: number;
          longitude: number;
          status: 'safe' | 'moderate' | 'restricted';
          rules: string[];
          description: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          latitude: number;
          longitude: number;
          status: 'safe' | 'moderate' | 'restricted';
          rules: string[];
          description: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          latitude?: number;
          longitude?: number;
          status?: 'safe' | 'moderate' | 'restricted';
          rules?: string[];
          description?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          category: string;
          difficulty: 'easy' | 'medium' | 'hard';
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          category: string;
          difficulty: 'easy' | 'medium' | 'hard';
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          options?: string[];
          correct_answer?: number;
          explanation?: string;
          category?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          created_at?: string;
        };
      };
      legal_news: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string;
          source: string;
          published_at: string;
          category: string;
          location: string;
          importance: 'low' | 'medium' | 'high' | 'critical';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          content: string;
          source: string;
          published_at: string;
          category: string;
          location: string;
          importance: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          content?: string;
          source?: string;
          published_at?: string;
          category?: string;
          location?: string;
          importance?: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          laws_learned: number;
          quiz_score: number;
          study_streak: number;
          last_activity: string;
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          laws_learned?: number;
          quiz_score?: number;
          study_streak?: number;
          last_activity?: string;
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          laws_learned?: number;
          quiz_score?: number;
          study_streak?: number;
          last_activity?: string;
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}