import { TimerSettings } from '../components/Settings';
import { Task } from '../components/TaskList';
import { UserStats } from '../components/Stats';

const STORAGE_KEYS = {
  SETTINGS: 'focusflow_settings',
  TASKS: 'focusflow_tasks',
  STATS: 'focusflow_stats',
  CURRENT_TASK: 'focusflow_current_task'
};

// Default timer settings
export const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25, // 25 minutes
  shortBreakTime: 5, // 5 minutes
  longBreakTime: 15, // 15 minutes
  longBreakInterval: 4, // After 4 pomodoros
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true
};

// Default user stats
export const DEFAULT_STATS: UserStats = {
  totalPomodoros: 0,
  totalFocusTime: 0,
  completedTasks: 0,
  currentStreak: 0
};

// Storage service for managing app data
class StorageService {
  // Load settings from localStorage
  public loadSettings(): TimerSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  }
  
  // Save settings to localStorage
  public saveSettings(settings: TimerSettings): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
  
  // Load tasks from localStorage
  public loadTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    return [];
  }
  
  // Save tasks to localStorage
  public saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }
  
  // Load user stats from localStorage
  public loadStats(): UserStats {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    
    try {
      const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
      if (savedStats) {
        return { ...DEFAULT_STATS, ...JSON.parse(savedStats) };
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    return DEFAULT_STATS;
  }
  
  // Save user stats to localStorage
  public saveStats(stats: UserStats): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }
  
  // Load current task ID from localStorage
  public loadCurrentTask(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_TASK);
    } catch (error) {
      console.error('Error loading current task:', error);
    }
    return null;
  }
  
  // Save current task ID to localStorage
  public saveCurrentTask(taskId: string | null): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (taskId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TASK, taskId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TASK);
      }
    } catch (error) {
      console.error('Error saving current task:', error);
    }
  }
  
  // Clear all application data
  public clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_TASK);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Singleton instance
export const storageService = new StorageService();

export default storageService; 