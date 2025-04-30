import { useEffect } from 'react';

interface TimerControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerControls({ 
  isActive, 
  onStart, 
  onPause, 
  onReset, 
  onSkip 
}: TimerControlsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (isActive) {
          onPause();
        } else {
          onStart();
        }
      } else if (e.key.toLowerCase() === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      } else if (e.key.toLowerCase() === 's' || e.key === 'S') {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onStart, onPause, onReset, onSkip]);

  return (
    <div className="timer-controls">
      <div className="controls-row">
        <button 
          className="control-btn primary-btn"
          onClick={isActive ? onPause : onStart}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
      
      <div className="controls-row secondary-controls">
        <button 
          className="control-btn secondary-btn"
          onClick={onReset}
        >
          Reset
        </button>
        <button 
          className="control-btn secondary-btn"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
      
      <style jsx>{`
        .timer-controls {
          margin: 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .controls-row {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          width: 100%;
        }
        .secondary-controls {
          gap: 1rem;
        }
        .control-btn {
          border: 1px solid #000;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
          min-width: 120px;
        }
        .primary-btn {
          background: #333;
          color: white;
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
        }
        .secondary-btn {
          background: #fff;
          color: #333;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
        .control-btn:hover {
          transform: translateY(-1px);
          box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.2);
        }
        .control-btn:active {
          transform: translateY(1px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
} 