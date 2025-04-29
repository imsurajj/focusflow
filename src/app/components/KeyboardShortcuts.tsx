import { useState, useEffect } from 'react';

export default function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <div className={`shortcuts-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="shortcuts-toggle" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '×' : '⌨️'}
      </div>

      {isVisible && (
        <div className="shortcuts-content">
          <h3 className="shortcuts-title">Keyboard Shortcuts</h3>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>Space</kbd>
              <span>Start/Pause</span>
            </div>
            <div className="shortcut-item">
              <kbd>R</kbd>
              <span>Reset Timer</span>
            </div>
            <div className="shortcut-item">
              <kbd>S</kbd>
              <span>Skip Phase</span>
            </div>
            <div className="shortcut-item">
              <kbd>F</kbd>
              <span>Toggle Fullscreen</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .shortcuts-container {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .shortcuts-container.hidden {
          opacity: 0.6;
        }
        
        .shortcuts-container:hover {
          opacity: 1;
        }
        
        .shortcuts-toggle {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #333;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.25rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 2;
        }
        
        .shortcuts-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 1rem 1.5rem 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          position: absolute;
          bottom: 45px;
          right: 0;
          width: 200px;
        }
        
        .shortcuts-title {
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          margin: 0 0 0.75rem;
          text-align: center;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 0.5rem;
        }
        
        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .shortcut-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }
        
        kbd {
          background: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.2);
          padding: 2px 6px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.75rem;
          min-width: 1.75rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
} 