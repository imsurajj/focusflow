import { useState } from 'react';

export interface UserStats {
  totalPomodoros: number;
  totalFocusTime: number; // in minutes
  completedTasks: number;
  currentStreak: number;
}

interface StatsProps {
  stats: UserStats;
}

export default function Stats({ stats }: StatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.totalPomodoros}</div>
          <div className="stat-label">Pomodoros</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{formatTime(stats.totalFocusTime)}</div>
          <div className="stat-label">Focus Time</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.completedTasks}</div>
          <div className="stat-label">Tasks Done</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>
      
      <style jsx>{`
        .stats-container {
          position: relative;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .stat-item {
          padding: 1rem;
          text-align: center;
          background: #f9f9f9;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-2px);
          background-color: #f5f5f5;
        }
        
        .stat-value {
          font-family: 'Courier Prime', monospace;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .stat-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
} 