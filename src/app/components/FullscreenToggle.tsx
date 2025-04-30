interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function FullscreenToggle({ isFullscreen, onToggleFullscreen }: FullscreenToggleProps) {
  return (
    <button 
      className="fullscreen-toggle" 
      onClick={onToggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
    >
      {isFullscreen ? 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg> 
        : 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      }
      
      <style jsx>{`
        .fullscreen-toggle {
          background: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          width: auto;
          height: auto;
          padding: 0.4rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #333;
        }
        
        .fullscreen-toggle:hover {
          background: #f0f0f0;
        }
      `}</style>
    </button>
  );
} 