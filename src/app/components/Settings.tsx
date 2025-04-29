import { useState, useEffect } from 'react';

export interface TimerSettings {
  focusTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number; // number of pomodoros before a long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  isEditMode?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
}

export default function Settings({ 
  settings, 
  onSettingsChange,
  isEditMode = false,
  onEditModeChange
}: SettingsProps) {
  const [tempSettings, setTempSettings] = useState<TimerSettings>(settings);

  // Reset temp settings when main settings change
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // Reset temp settings when edit mode changes
  useEffect(() => {
    if (!isEditMode) {
      setTempSettings(settings);
    }
  }, [isEditMode, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setTempSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsChange(tempSettings);
    if (onEditModeChange) {
      onEditModeChange(false);
    }
  };

  const handleCancel = () => {
    setTempSettings(settings);
    if (onEditModeChange) {
      onEditModeChange(false);
    }
  };

  return (
    <div className="settings-container">
      {isEditMode ? (
        <div className="settings-form-container">
          <form onSubmit={handleSubmit}>
            <div className="settings-group">
              <h3>Time (minutes)</h3>
              
              <div className="setting-item">
                <label htmlFor="focusTime">Focus Time:</label>
                <input
                  type="number"
                  id="focusTime"
                  name="focusTime"
                  min="1"
                  max="60"
                  value={tempSettings.focusTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="setting-item">
                <label htmlFor="shortBreakTime">Short Break:</label>
                <input
                  type="number"
                  id="shortBreakTime"
                  name="shortBreakTime"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreakTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="setting-item">
                <label htmlFor="longBreakTime">Long Break:</label>
                <input
                  type="number"
                  id="longBreakTime"
                  name="longBreakTime"
                  min="1"
                  max="60"
                  value={tempSettings.longBreakTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="setting-item">
                <label htmlFor="longBreakInterval">Long Break After:</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="longBreakInterval"
                    name="longBreakInterval"
                    min="1"
                    max="10"
                    value={tempSettings.longBreakInterval}
                    onChange={handleChange}
                  />
                  <span className="unit">pomodoros</span>
                </div>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Auto Start</h3>
              
              <div className="setting-item checkbox">
                <input
                  type="checkbox"
                  id="autoStartBreaks"
                  name="autoStartBreaks"
                  checked={tempSettings.autoStartBreaks}
                  onChange={handleChange}
                />
                <label htmlFor="autoStartBreaks">Auto-start Breaks</label>
              </div>
              
              <div className="setting-item checkbox">
                <input
                  type="checkbox"
                  id="autoStartPomodoros"
                  name="autoStartPomodoros"
                  checked={tempSettings.autoStartPomodoros}
                  onChange={handleChange}
                />
                <label htmlFor="autoStartPomodoros">Auto-start Pomodoros</label>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Sound</h3>
              
              <div className="setting-item checkbox">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  name="soundEnabled"
                  checked={tempSettings.soundEnabled}
                  onChange={handleChange}
                />
                <label htmlFor="soundEnabled">Sound Notifications</label>
              </div>
            </div>
            
            <div className="settings-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="settings-summary">
          <div className="settings-summary-group">
            <div className="summary-item">
              <span className="summary-label">Focus:</span>
              <span className="summary-value">{settings.focusTime} min</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Short Break:</span>
              <span className="summary-value">{settings.shortBreakTime} min</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Long Break:</span>
              <span className="summary-value">{settings.longBreakTime} min</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Long Break After:</span>
              <span className="summary-value">{settings.longBreakInterval} pomodoros</span>
            </div>
          </div>
          <div className="settings-summary-group">
            <div className="summary-item">
              <span className="summary-label">Auto-start Breaks:</span>
              <span className="summary-value">{settings.autoStartBreaks ? 'On' : 'Off'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Auto-start Pomodoros:</span>
              <span className="summary-value">{settings.autoStartPomodoros ? 'On' : 'Off'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Sound:</span>
              <span className="summary-value">{settings.soundEnabled ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .settings-container {
          width: 100%;
        }
        
        .settings-summary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .settings-summary-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Courier Prime', monospace;
        }
        
        .summary-label {
          color: #666;
          font-size: 0.95rem;
        }
        
        .summary-value {
          font-weight: bold;
          color: #333;
        }
        
        .settings-form-container {
          width: 100%;
        }
        
        .settings-group {
          margin-bottom: 1.5rem;
        }
        
        .settings-group h3 {
          font-family: 'Courier Prime', monospace;
          font-size: 1.1rem;
          color: #333;
          margin: 0 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-family: 'Courier Prime', monospace;
        }
        
        .setting-item label {
          color: #555;
        }
        
        .setting-item input[type="number"] {
          width: 60px;
          padding: 0.4rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: 'Courier Prime', monospace;
          text-align: center;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .unit {
          color: #666;
          font-size: 0.85rem;
        }
        
        .setting-item.checkbox {
          justify-content: flex-start;
          gap: 0.6rem;
        }
        
        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        button {
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          font-family: 'Courier Prime', monospace;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          border: 1px solid #333;
        }
        
        .cancel-btn {
          background: #fff;
          color: #333;
        }
        
        .save-btn {
          background: #333;
          color: #fff;
        }
        
        .cancel-btn:hover, .save-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
} 