import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Use your actual Supabase credentials
const supabaseUrl = 'https://fgsymrtwgkuqarsfhwxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3ltcnR3Z2t1cWFyc2Zod3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDQ2OTksImV4cCI6MjA2NTQ4MDY5OX0.LRn_eACrbxFOQ1Y823WY-4lgL3tYMbUii6oELmF74ow';

// Create Supabase client with better error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'x-application-name': 'legal-awareness-app',
    },
  },
});

// Sample data for fallback
const sampleLaws = [
  {
    id: '1',
    title: 'Right to Information Act, 2005',
    description: 'Citizens have the right to access information from public authorities to promote transparency and accountability.',
    content: 'The Right to Information Act, 2005 is an Act of the Parliament of India to provide for setting out the practical regime of right to information for citizens.',
    category: 'Constitutional Rights',
    location: 'India',
    severity: 'medium',
    tags: ['transparency', 'government', 'information'],
    source: 'Government of India',
    effective_date: '2005-10-12',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Motor Vehicle Act - Speed Limits',
    description: 'Speed limits for different types of vehicles on various road types to ensure road safety.',
    content: 'Speed limits are enforced to ensure road safety and reduce accidents. Cars: 40 km/h in cities, 60 km/h on highways.',
    category: 'Traffic Laws',
    location: 'India',
    severity: 'high',
    tags: ['driving', 'safety', 'speed'],
    source: 'Ministry of Road Transport and Highways',
    effective_date: '1988-07-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Consumer Protection Act, 2019',
    description: 'Protection of consumer rights and establishment of consumer dispute redressal mechanisms.',
    content: 'The Consumer Protection Act, 2019 aims to protect the interests of consumers and provides for establishment of consumer protection councils.',
    category: 'Consumer Rights',
    location: 'India',
    severity: 'medium',
    tags: ['consumer', 'protection', 'rights'],
    source: 'Ministry of Consumer Affairs',
    effective_date: '2019-07-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Information Technology Act - Cybercrime',
    description: 'Legal framework for electronic governance and prevention of cybercrimes.',
    content: 'The IT Act provides legal framework for electronic transactions and cybercrime prevention.',
    category: 'Cyber Law',
    location: 'India',
    severity: 'high',
    tags: ['cyber', 'technology', 'crime'],
    source: 'Ministry of Electronics and IT',
    effective_date: '2000-10-17',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Domestic Violence Act, 2005',
    description: 'Protection of women from domestic violence and provision of immediate relief.',
    content: 'The Protection of Women from Domestic Violence Act, 2005 is an Act to protect women from domestic violence.',
    category: 'Women Rights',
    location: 'India',
    severity: 'critical',
    tags: ['women', 'protection', 'violence'],
    source: 'Ministry of Women and Child Development',
    effective_date: '2005-10-26',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Indian Penal Code - Section 498A',
    description: 'Protection against cruelty by husband or relatives of husband.',
    content: 'Section 498A deals with cruelty by husband or relatives of husband towards a married woman.',
    category: 'Women Rights',
    location: 'India',
    severity: 'high',
    tags: ['women', 'marriage', 'protection'],
    source: 'Indian Penal Code',
    effective_date: '1983-12-25',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    title: 'Fundamental Rights - Article 21',
    description: 'Right to life and personal liberty guaranteed under the Constitution.',
    content: 'Article 21 guarantees that no person shall be deprived of his life or personal liberty except according to procedure established by law.',
    category: 'Constitutional Rights',
    location: 'India',
    severity: 'critical',
    tags: ['constitution', 'rights', 'liberty'],
    source: 'Constitution of India',
    effective_date: '1950-01-26',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    title: 'Helmet Rules for Two-Wheelers',
    description: 'Mandatory helmet wearing for riders and pillion passengers.',
    content: 'Wearing helmet is mandatory for both rider and pillion passenger. Fine: ₹1000 for violation.',
    category: 'Traffic Laws',
    location: 'India',
    severity: 'medium',
    tags: ['helmet', 'safety', 'two-wheeler'],
    source: 'Motor Vehicle Act',
    effective_date: '1988-07-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleZones = [
  {
    id: '1',
    name: 'Connaught Place',
    location: 'New Delhi',
    latitude: 28.6315,
    longitude: 77.2167,
    status: 'safe',
    rules: ['No smoking in public areas', 'Parking restrictions apply'],
    description: 'Central business district with moderate legal restrictions',
    severity: 'low',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Red Fort Area',
    location: 'Old Delhi',
    latitude: 28.6562,
    longitude: 77.2410,
    status: 'restricted',
    rules: ['Security checks mandatory', 'No photography in certain areas', 'Bag restrictions'],
    description: 'Historical monument with high security protocols',
    severity: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'India Gate',
    location: 'Central Delhi',
    latitude: 28.6129,
    longitude: 77.2295,
    status: 'moderate',
    rules: ['No vehicles after 6 PM', 'Vendor restrictions'],
    description: 'Public monument with time-based restrictions',
    severity: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cyber City',
    location: 'Gurgaon',
    latitude: 28.4595,
    longitude: 77.0266,
    status: 'safe',
    rules: ['Corporate dress code in office areas', 'ID required for entry'],
    description: 'Modern business district with minimal restrictions',
    severity: 'low',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleQuestions = [
  {
    id: '1',
    question: 'What is the time limit for filing an RTI application response?',
    options: ['15 days', '30 days', '45 days', '60 days'],
    correct_answer: 1,
    explanation: 'Under the RTI Act 2005, public authorities must respond to RTI applications within 30 days of receipt.',
    difficulty: 'easy',
    category: 'Constitutional Rights',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    question: 'What is the maximum speed limit for cars in city areas?',
    options: ['40 km/h', '50 km/h', '60 km/h', '80 km/h'],
    correct_answer: 0,
    explanation: 'In most Indian cities, the speed limit for cars is 40 km/h to ensure pedestrian safety.',
    difficulty: 'medium',
    category: 'Traffic Laws',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    question: 'Under Consumer Protection Act, what is the time limit to file a complaint?',
    options: ['1 year', '2 years', '3 years', '5 years'],
    correct_answer: 1,
    explanation: 'Consumers can file complaints within 2 years from the date of cause of action under the Consumer Protection Act.',
    difficulty: 'medium',
    category: 'Consumer Rights',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    question: 'Which article of the Constitution guarantees Right to Life?',
    options: ['Article 19', 'Article 20', 'Article 21', 'Article 22'],
    correct_answer: 2,
    explanation: 'Article 21 of the Indian Constitution guarantees the Right to Life and Personal Liberty.',
    difficulty: 'easy',
    category: 'Constitutional Rights',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    question: 'What is the penalty for not wearing a helmet while riding?',
    options: ['₹500', '₹1000', '₹1500', '₹2000'],
    correct_answer: 1,
    explanation: 'The penalty for not wearing a helmet while riding a two-wheeler is ₹1000 under the Motor Vehicle Act.',
    difficulty: 'medium',
    category: 'Traffic Laws',
    created_at: new Date().toISOString()
  }
];

const sampleNews = [
  {
    id: '1',
    title: 'New Consumer Protection Guidelines Released',
    summary: 'Government announces enhanced consumer protection measures for online shopping.',
    content: 'The Ministry of Consumer Affairs has released new guidelines to protect consumers in digital transactions.',
    source: 'Ministry of Consumer Affairs',
    published_at: new Date().toISOString(),
    category: 'Consumer Rights',
    location: 'India',
    importance: 'medium',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Traffic Law Amendments in Major Cities',
    summary: 'Updated traffic regulations and penalties come into effect.',
    content: 'New traffic laws with stricter penalties for violations have been implemented across major Indian cities.',
    source: 'Ministry of Road Transport',
    published_at: new Date().toISOString(),
    category: 'Traffic Laws',
    location: 'India',
    importance: 'high',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Digital Privacy Rights Update',
    summary: 'New guidelines for data protection and digital privacy.',
    content: 'Updated privacy guidelines ensure better protection of personal data in digital platforms.',
    source: 'Ministry of Electronics and IT',
    published_at: new Date().toISOString(),
    category: 'Cyber Law',
    location: 'India',
    importance: 'high',
    created_at: new Date().toISOString()
  }
];

// Enhanced helper function with better error handling and timeout
const safeDbOperation = async <T>(
  operation: () => Promise<T>, 
  fallback: T,
  timeout: number = 5000
): Promise<T> => {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), timeout);
    });

    // Race between the operation and timeout
    const result = await Promise.race([operation(), timeoutPromise]);
    
    // Return result if it exists, otherwise fallback
    return result || fallback;
  } catch (error) {
    // Log the error for debugging but don't throw
    console.warn('Database operation failed, using fallback data:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    return fallback;
  }
};

// Test database connectivity
const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('laws')
      .select('id')
      .limit(1);
    
    return !error && data !== null;
  } catch (error) {
    console.warn('Database connectivity test failed:', error);
    return false;
  }
};

// API functions for laws
export const lawsAPI = {
  async getAll() {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleLaws);
  },

  async getByCategory(category: string) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleLaws.filter(law => law.category === category));
  },

  async getByLocation(location: string) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleLaws.filter(law => law.location === location));
  },

  async search(query: string) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleLaws.filter(law => 
      law.title.toLowerCase().includes(query.toLowerCase()) ||
      law.description.toLowerCase().includes(query.toLowerCase()) ||
      law.content.toLowerCase().includes(query.toLowerCase())
    ));
  },

  async getBySeverity(severity: 'low' | 'medium' | 'high' | 'critical') {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('laws')
        .select('*')
        .eq('severity', severity)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleLaws.filter(law => law.severity === severity));
  }
};

// API functions for legal zones
export const zonesAPI = {
  async getAll() {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('legal_zones')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }, sampleZones);
  },

  async getByStatus(status: 'safe' | 'moderate' | 'restricted') {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('legal_zones')
        .select('*')
        .eq('status', status)
        .order('name');
      
      if (error) throw error;
      return data;
    }, sampleZones.filter(zone => zone.status === status));
  },

  async getNearby(latitude: number, longitude: number, radius: number = 10) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('legal_zones')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data?.filter(zone => {
        const latDiff = Math.abs(zone.latitude - latitude);
        const lonDiff = Math.abs(zone.longitude - longitude);
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        return distance <= radius;
      });
    }, sampleZones);
  }
};

// API functions for quiz questions
export const quizAPI = {
  async getQuestions(category?: string, difficulty?: string) {
    return safeDbOperation(async () => {
      let query = supabase.from('quiz_questions').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleQuestions.filter(q => 
      (!category || q.category === category) && 
      (!difficulty || q.difficulty === difficulty)
    ));
  },

  async getRandomQuestions(count: number = 10) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .limit(count);
      
      if (error) throw error;
      
      return data?.sort(() => Math.random() - 0.5);
    }, sampleQuestions.sort(() => Math.random() - 0.5).slice(0, count));
  }
};

// Enhanced API functions for legal news
export const newsAPI = {
  async getLatest() {
    return safeDbOperation(async () => {
      const { data: dbNews, error } = await supabase
        .from('legal_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (dbNews && dbNews.length > 0) {
        return dbNews;
      }
      
      return sampleNews;
    }, sampleNews);
  },

  async getByCategory(category: string) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('legal_news')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleNews.filter(news => news.category === category));
  },

  async getByImportance(importance: 'low' | 'medium' | 'high' | 'critical') {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('legal_news')
        .select('*')
        .eq('importance', importance)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, sampleNews.filter(news => news.importance === importance));
  }
};

// API functions for user progress
export const progressAPI = {
  async getUserProgress(userId: string) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    }, {
      id: '1',
      user_id: userId,
      laws_learned: 47,
      quiz_score: 85,
      study_streak: 12,
      last_activity: new Date().toISOString(),
      achievements: ['First Quiz', 'Week Streak'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  async updateProgress(userId: string, updates: any) {
    return safeDbOperation(async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, {
      id: '1',
      user_id: userId,
      laws_learned: updates.laws_learned || 47,
      quiz_score: updates.quiz_score || 85,
      study_streak: updates.study_streak || 12,
      last_activity: new Date().toISOString(),
      achievements: updates.achievements || ['First Quiz', 'Week Streak'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  async incrementLawsLearned(userId: string) {
    const currentProgress = await this.getUserProgress(userId);
    const newCount = (currentProgress?.laws_learned || 0) + 1;
    
    return this.updateProgress(userId, {
      laws_learned: newCount,
      last_activity: new Date().toISOString()
    });
  },

  async updateQuizScore(userId: string, score: number) {
    return this.updateProgress(userId, {
      quiz_score: score,
      last_activity: new Date().toISOString()
    });
  },

  async updateStudyStreak(userId: string) {
    const currentProgress = await this.getUserProgress(userId);
    const lastActivity = currentProgress?.last_activity ? new Date(currentProgress.last_activity) : null;
    const today = new Date();
    
    let newStreak = 1;
    
    if (lastActivity) {
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newStreak = (currentProgress?.study_streak || 0) + 1;
      } else if (daysDiff === 0) {
        newStreak = currentProgress?.study_streak || 1;
      }
    }
    
    return this.updateProgress(userId, {
      study_streak: newStreak,
      last_activity: today.toISOString()
    });
  }
};

// Utility functions
export const utilsAPI = {
  async searchAll(query: string) {
    try {
      const [laws, news] = await Promise.all([
        lawsAPI.search(query),
        newsAPI.getByCategory('Legal News')
      ]);

      return {
        laws: laws || [],
        news: news || [],
        total: (laws?.length || 0) + (news?.length || 0)
      };
    } catch (error) {
      console.warn('Error in searchAll:', error);
      return { laws: sampleLaws, news: sampleNews, total: sampleLaws.length + sampleNews.length };
    }
  },

  async getStats() {
    return {
      laws: sampleLaws.length,
      zones: sampleZones.length,
      questions: sampleQuestions.length,
      news: sampleNews.length
    };
  },

  async checkConnection() {
    return await testConnection();
  }
};

// Export the supabase client for direct use if needed
export { supabase, testConnection };