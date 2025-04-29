import React from 'react';

export type Phase = 'focus' | 'shortBreak' | 'longBreak';

interface TimerPhaseProps {
  phase: Phase;
  currentPomodoro: number;
  totalPomodoros: number;
  isFullscreen?: boolean;
}

export default function TimerPhase({ 
  phase, 
  currentPomodoro, 
  totalPomodoros,
  isFullscreen = false 
}: TimerPhaseProps) {
  const getPhaseLabel = () => {
    switch (phase) {
      case 'focus':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus';
    }
  };

  return (
    <div className={`timer-phase ${isFullscreen ? 'fullscreen' : ''}`}>
      <h2 className={`phase-title ${phase}`}>{getPhaseLabel()}</h2>
      
      <div className="pomodoro-progress">
        {Array(totalPomodoros).fill(null).map((_, index) => (
          <div 
            key={index} 
            className={`pomodoro-indicator ${index < currentPomodoro ? 'completed' : ''} ${index === currentPomodoro && phase === 'focus' ? 'current' : ''}`}
          />
        ))}
      </div>
      
      <style jsx>{`
        .timer-phase {
          text-align: left;
          margin-bottom: 1rem;
          width: 100%;
        }
        
        .timer-phase.fullscreen {
          margin-bottom: 0;
        }
        
        .timer-phase.fullscreen .phase-title {
          font-size: 1.4rem;
        }
        
        .timer-phase.fullscreen .pomodoro-progress {
          justify-content: flex-start;
        }
        
        .phase-title {
          font-family: 'Courier Prime', monospace;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          display: inline-block;
          position: relative;
        }
        
        .phase-title.focus {
          color: #333;
        }
        
        .phase-title.shortBreak {
          color: #4caf50;
        }
        
        .phase-title.longBreak {
          color: #2196f3;
        }
        
        .phase-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: currentColor;
          opacity: 0.5;
        }
        
        .pomodoro-progress {
          display: flex;
          justify-content: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .pomodoro-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.3);
          background: #fff;
        }
        
        .pomodoro-indicator.completed {
          background: #333;
          border-color: #333;
        }
        
        .pomodoro-indicator.current {
          background: #fff;
          border: 1px solid #333;
        }
        
        .pomodoro-indicator.completed.current {
          background: #333;
        }

        @media (max-width: 600px) {
          .phase-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
} 