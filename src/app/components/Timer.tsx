import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number; // in seconds
  isActive: boolean;
  isBreak: boolean;
  onComplete: () => void;
  isFullscreen?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
}

export default function Timer({ 
  initialTime, 
  isActive, 
  isBreak, 
  onComplete,
  isFullscreen = false,
  onStart,
  onPause,
  onReset,
  onSkip 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerType, setTimerType] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [stopwatchTime, setStopwatchTime] = useState(0);
  
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (isActive && onPause) {
          onPause();
        } else if (onStart) {
          onStart();
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (onReset) onReset();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (onSkip) onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onStart, onPause, onReset, onSkip]);
  
  useEffect(() => {
    if (timerType === 'pomodoro') {
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(0);
      setStopwatchTime(0);
    }
  }, [initialTime, timerType]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      if (timerType === 'pomodoro' && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              if (interval) clearInterval(interval);
              onComplete();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else if (timerType === 'stopwatch') {
        interval = setInterval(() => {
          setStopwatchTime(prevTime => prevTime + 1);
        }, 1000);
      }
    }
    
    if (timerType === 'pomodoro' && timeLeft === 0 && !isActive) {
      onComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete, timerType, stopwatchTime]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const percentComplete = timerType === 'pomodoro' 
    ? ((initialTime - timeLeft) / initialTime) * 100
    : 0;
  
  const displayTime = timerType === 'pomodoro' 
    ? formatTime(timeLeft) 
    : formatTime(stopwatchTime);
  
  return (
    <div className={`timer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="timer-mode-selector">
        <button 
          className={`mode-btn ${timerType === 'pomodoro' ? 'active' : ''}`}
          onClick={() => setTimerType('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`mode-btn ${timerType === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setTimerType('stopwatch')}
        >
          Stopwatch
        </button>
      </div>
      
      <div 
        className={`timer-display ${isBreak ? 'break' : 'focus'} ${isActive ? 'active' : ''}`}
      >
        <div className="timer-inner">
          <span className="time">{displayTime}</span>
          {!isFullscreen && (
            <div className="timer-status">
              {isActive ? (timerType === 'pomodoro' ? 'RUNNING' : 'RUNNING') : 'PAUSED'}
            </div>
          )}
        </div>
        {timerType === 'pomodoro' && (
          <div 
            className="progress-bar" 
            style={{ width: `${percentComplete}%` }}
          />
        )}
      </div>
      
      <div className="timer-controls">
        <button
          className="control-btn secondary-btn"
          onClick={onReset}
        >
          Reset
        </button>
        
        <button 
          className="control-btn primary-btn"
          onClick={isActive ? onPause : onStart}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        {timerType === 'pomodoro' && (
          <button
            className="control-btn secondary-btn"
            onClick={onSkip}
          >
            Skip
          </button>
        )}
      </div>
      
      <style jsx>{`
        .timer-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 1.5rem 0;
        }
        
        .timer-container.fullscreen {
          transform: none;
          margin: 0;
          padding-top: 0;
        }
        
        .timer-mode-selector {
          display: flex;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .mode-btn {
          padding: 0.5rem 1.5rem;
          border: none;
          background-color: white;
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .mode-btn:first-child {
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .mode-btn.active {
          background-color: #333;
          color: white;
        }
        
        .timer-display {
          width: 300px;
          padding: 2rem 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          position: relative;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .timer-container.fullscreen .timer-display {
          width: 550px;
          padding: 3rem 1rem;
          background-color: transparent;
          border: none;
        }
        
        .timer-inner {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .timer-display.active {
          animation: pulse 2s infinite;
        }
        
        .time {
          font-family: 'Courier Prime', monospace;
          font-size: 6.5rem;
          font-weight: bold;
          color: #333;
          line-height: 1;
        }
        
        .timer-container.fullscreen .time {
          font-size: 12rem;
        }
        
        .timer-status {
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.5rem;
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.1);
          transition: width 1s linear;
        }
        
        .timer-controls {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .control-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid #333;
        }
        
        .primary-btn {
          background-color: #333;
          color: white;
        }
        
        .secondary-btn {
          background-color: transparent;
          color: #333;
        }
        
        .control-btn:hover {
          opacity: 0.9;
        }
        
        @keyframes pulse {
          0% {
            background-color: rgba(255, 255, 255, 1);
          }
          50% {
            background-color: rgba(245, 245, 245, 1);
          }
          100% {
            background-color: rgba(255, 255, 255, 1);
          }
        }
        
        @media (max-width: 600px) {
          .timer-display {
            width: 270px;
            padding: 1.5rem 1rem;
          }
          
          .time {
            font-size: 4.5rem;
          }
          
          .mode-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          
          .control-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }
        }
        
        @media (min-width: 1920px) {
          .timer-container:not(.fullscreen) {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
} 