'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import Timer from './components/Timer';
import TaskInput from './components/TaskInput';
import TaskList, { Task } from './components/TaskList';
import Settings, { TimerSettings } from './components/Settings';
import Stats, { UserStats } from './components/Stats';
import TimerPhase, { Phase } from './components/TimerPhase';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import FullscreenToggle from './components/FullscreenToggle';

// Utilities
import soundService from './utils/sound';
import storageService, { DEFAULT_SETTINGS, DEFAULT_STATS } from './utils/storage';

export default function Home() {
  // App state
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  
  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('focus');
  const [currentTime, setCurrentTime] = useState(settings.focusTime * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentPomodoro, setCurrentPomodoro] = useState(0);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [tasksCardOpen, setTasksCardOpen] = useState(true);
  const [settingsCardOpen, setSettingsCardOpen] = useState(false);
  
  // Add state to track which card is open
  const [activeCard, setActiveCard] = useState<'tasks' | 'settings' | 'stats'>('tasks');
  const [isSettingsEditMode, setIsSettingsEditMode] = useState(false);
  
  // Initialize app - load data from localStorage
  useEffect(() => {
    // Load saved settings
    const savedSettings = storageService.loadSettings();
    setSettings(savedSettings);
    
    // Load saved tasks
    const savedTasks = storageService.loadTasks();
    setTasks(savedTasks);
    
    // Load saved stats
    const savedStats = storageService.loadStats();
    setStats(savedStats);
    
    // Load current task
    const savedCurrentTask = storageService.loadCurrentTask();
    setCurrentTask(savedCurrentTask);
    
    // Initialize sound service
    soundService.initialize();
    soundService.setEnabled(savedSettings.soundEnabled);
    
    // Set initial timer based on phase
    setCurrentTime(savedSettings.focusTime * 60);
  }, []);

  // Add fullscreen keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // 'F' key for fullscreen
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Fullscreen change detector
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto open/close cards based on tasks
  useEffect(() => {
    if (tasks.length > 0) {
      setTasksCardOpen(true);
    }
  }, [tasks]);
  
  // Save settings when they change
  useEffect(() => {
    storageService.saveSettings(settings);
    soundService.setEnabled(settings.soundEnabled);
  }, [settings]);
  
  // Save tasks when they change
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);
  
  // Save stats when they change
  useEffect(() => {
    storageService.saveStats(stats);
  }, [stats]);
  
  // Save current task when it changes
  useEffect(() => {
    storageService.saveCurrentTask(currentTask);
  }, [currentTask]);
  
  // Reset timer when phase changes
  useEffect(() => {
    let time = 0;
    
    switch (phase) {
      case 'focus':
        time = settings.focusTime * 60;
        break;
      case 'shortBreak':
        time = settings.shortBreakTime * 60;
        break;
      case 'longBreak':
        time = settings.longBreakTime * 60;
        break;
    }
    
    setCurrentTime(time);
    
    // Auto-start timer based on settings
    if (
      (phase !== 'focus' && settings.autoStartBreaks) ||
      (phase === 'focus' && settings.autoStartPomodoros)
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [phase, settings]);
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    // Play sound notification
    if (settings.soundEnabled) {
      if (phase === 'focus') {
        soundService.play('timerComplete');
      } else if (phase === 'shortBreak') {
        soundService.play('shortBreak');
      } else {
        soundService.play('longBreak');
      }
    }
    
    if (phase === 'focus') {
      // Increment pomodoro count
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      
      // Update task pomodoro count if there's a current task
      if (currentTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === currentTask 
              ? { ...task, pomodoros: task.pomodoros + 1 } 
              : task
          )
        );
      }
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalPomodoros: prevStats.totalPomodoros + 1,
        totalFocusTime: prevStats.totalFocusTime + settings.focusTime
      }));
      
      // Determine next phase
      if (newPomodoroCount % settings.longBreakInterval === 0) {
        setPhase('longBreak');
      } else {
        setPhase('shortBreak');
      }
    } else {
      // After a break, go back to focus mode
      setPhase('focus');
      
      // Move to next pomodoro
      if (phase === 'longBreak') {
        setCurrentPomodoro(currentPomodoro + 1);
      }
    }
  }, [phase, pomodoroCount, currentTask, settings, currentPomodoro]);
  
  // Add a new task
  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
      pomodoros: 0
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // If no task is selected, select this one
    if (!currentTask) {
      setCurrentTask(newTask.id);
    }
  };
  
  // Mark a task as complete
  const handleTaskComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    // Update stats if task is being completed (not uncompleted)
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setStats(prevStats => ({
        ...prevStats,
        completedTasks: prevStats.completedTasks + 1
      }));
    }
  };
  
  // Delete a task
  const handleTaskDelete = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    // If the deleted task was the current task, clear current task
    if (currentTask === id) {
      setCurrentTask(null);
    }
  };
  
  // Select a task for the pomodoro
  const handleSelectTask = (id: string) => {
    setCurrentTask(id);
    // Close tasks popup if in fullscreen
    if (isFullscreen) {
      setShowTasksPopup(false);
    }
  };
  
  // Timer control handlers
  const handleStart = () => {
    setIsActive(true);
  };
  
  const handlePause = () => {
    setIsActive(false);
  };
  
  const handleReset = () => {
    setIsActive(false);
    
    // Reset timer based on current phase
    switch (phase) {
      case 'focus':
        setCurrentTime(settings.focusTime * 60);
        break;
      case 'shortBreak':
        setCurrentTime(settings.shortBreakTime * 60);
        break;
      case 'longBreak':
        setCurrentTime(settings.longBreakTime * 60);
        break;
    }
  };
  
  const handleSkip = () => {
    setIsActive(false);
    
    if (phase === 'focus') {
      // Skip to break
      if ((pomodoroCount + 1) % settings.longBreakInterval === 0) {
        setPhase('longBreak');
      } else {
        setPhase('shortBreak');
      }
    } else {
      // Skip to focus
      setPhase('focus');
      
      // Move to next pomodoro if skipping long break
      if (phase === 'longBreak') {
        setCurrentPomodoro(currentPomodoro + 1);
      }
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
            setShowTasksPopup(false);
          })
          .catch(err => {
            console.error(`Error attempting to exit full-screen mode: ${err.message}`);
          });
      }
    }
  };

  // Toggle card function
  const toggleCard = (card: 'tasks' | 'settings' | 'stats') => {
    setActiveCard(activeCard === card ? null : card);
  };

  // Current task name for display
  const currentTaskName = currentTask 
    ? tasks.find(task => task.id === currentTask)?.text || '' 
    : '';
  
  return (
    <main className={`container ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <KeyboardShortcuts />

      {!isFullscreen && (
        <header className="app-header">
          <h1 className="app-title">FocusFlow</h1>
          <p className="app-subtitle">Pomodoro Timer & Task Manager</p>
        </header>
      )}
      
      {isFullscreen ? (
        <div className="timer-fullscreen-wrapper">
          <div className="timer-top-row">
            <TimerPhase 
              phase={phase} 
              currentPomodoro={currentPomodoro} 
              totalPomodoros={settings.longBreakInterval} 
              isFullscreen={isFullscreen}
            />
            
            <div className="fullscreen-controls">
              <div className="fullscreen-dropdown">
                <button className="fullscreen-task-btn">
                  Tasks ▼
                </button>
                <div className="dropdown-content">
                  <TaskList 
                    tasks={tasks} 
                    onTaskComplete={handleTaskComplete}
                    onTaskDelete={handleTaskDelete}
                    currentTask={currentTask}
                    onSelectTask={handleSelectTask}
                  />
                  <div className="dropdown-task-input">
                    <TaskInput onAddTask={handleAddTask} />
                  </div>
                </div>
              </div>
              
              <div className="current-task-dropdown">
                <button className="fullscreen-task-btn">
                  {currentTaskName ? `Current: ${currentTaskName.substring(0, 15)}${currentTaskName.length > 15 ? '...' : ''}` : 'No Task Selected'} ▼
                </button>
                <div className="dropdown-content task-selection">
                  <h3 className="dropdown-title">Select Current Task</h3>
                  <div className="task-selection-list">
                    {tasks.length > 0 ? (
                      tasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`task-selection-item ${currentTask === task.id ? 'active' : ''}`}
                          onClick={() => handleSelectTask(task.id)}
                        >
                          {task.text}
                        </div>
                      ))
                    ) : (
                      <div className="no-tasks-message">No tasks added yet</div>
                    )}
                  </div>
                </div>
              </div>
              
              <FullscreenToggle isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
            </div>
          </div>

          <Timer 
            initialTime={currentTime}
            isActive={isActive}
            isBreak={phase !== 'focus'}
            onComplete={handleTimerComplete}
            isFullscreen={isFullscreen}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSkip={handleSkip}
          />
        </div>
      ) : (
        <div className="app-content-wrapper">
          <div className="main-content">
            <div className="timer-section">
              <div className="timer-header">
                <TimerPhase 
                  phase={phase} 
                  currentPomodoro={currentPomodoro} 
                  totalPomodoros={settings.longBreakInterval} 
                  isFullscreen={isFullscreen}
                />
                
                <div className="timer-header-controls">
                  {currentTaskName && (
                    <div className="current-task-display">
                      <span className="current-task-name">{currentTaskName}</span>
                    </div>
                  )}
                  <FullscreenToggle isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
                </div>
              </div>

              <Timer 
                initialTime={currentTime}
                isActive={isActive}
                isBreak={phase !== 'focus'}
                onComplete={handleTimerComplete}
                isFullscreen={isFullscreen}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onSkip={handleSkip}
              />
            </div>
          </div>
          
          <div className="side-panel">
            <div className="cards-stack">
              <div className="card tasks-card">
                <div 
                  className="card-header"
                  onClick={() => toggleCard('tasks')}
                >
                  <h2 className="card-title">Tasks</h2>
                  <span className="expand-icon">{activeCard === 'tasks' ? '▼' : '▶'}</span>
                </div>
                
                {activeCard === 'tasks' && (
                  <div className="card-content">
                    <TaskInput onAddTask={handleAddTask} />
                    
                    <TaskList 
                      tasks={tasks} 
                      onTaskComplete={handleTaskComplete}
                      onTaskDelete={handleTaskDelete}
                      currentTask={currentTask}
                      onSelectTask={handleSelectTask}
                    />
                  </div>
                )}
              </div>
              
              <div className="card settings-card">
                <div 
                  className="card-header"
                  onClick={() => toggleCard('settings')}
                >
                  <h2 className="card-title">Timer Settings</h2>
                  <div className="card-controls">
                    {activeCard === 'settings' && (
                      <button 
                        className="edit-settings-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSettingsEditMode(!isSettingsEditMode);
                        }}
                      >
                        {isSettingsEditMode ? 'Cancel' : 'Edit'}
                      </button>
                    )}
                    <span className="expand-icon">{activeCard === 'settings' ? '▼' : '▶'}</span>
                  </div>
                </div>
                
                {activeCard === 'settings' && (
                  <div className="card-content">
                    <Settings 
                      settings={settings}
                      onSettingsChange={setSettings}
                      isEditMode={isSettingsEditMode}
                      onEditModeChange={setIsSettingsEditMode}
                    />
                  </div>
                )}
              </div>
              
              <div className="card stats-card">
                <div 
                  className="card-header"
                  onClick={() => toggleCard('stats')}
                >
                  <h2 className="card-title">Your Stats</h2>
                  <span className="expand-icon">{activeCard === 'stats' ? '▼' : '▶'}</span>
                </div>
                
                {activeCard === 'stats' && (
                  <div className="card-content">
                    <Stats stats={stats} />
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
      )}
      
      <style jsx>{`
        .container {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 2rem 1rem;
          background-color: #f8f8f8;
          background-image: 
            linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .app-content-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timer-section {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timer-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .timer-header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .current-task-display {
          background: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 0.4rem 0.8rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          font-weight: 500;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .current-task-name {
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-content {
          padding: 1.5rem;
          flex: 1;
          overflow-y: auto;
          max-height: 350px;
        }
        
        @media (min-width: 1024px) {
          .app-content-wrapper {
            flex-direction: row;
            gap: 2rem;
          }
          
          .main-content {
            flex: 0 0 70%;
          }
          
          .side-panel {
            flex: 0 0 30%;
            max-width: 30%;
          }
        }
        
        .fullscreen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .timer-fullscreen-wrapper {
          max-width: 90%;
          width: 100%;
          margin: 0 auto;
          padding-top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timer-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          padding: 0.5rem 1rem;
          margin-bottom: 0;
        }

        .fullscreen-controls {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.5rem;
        }

        .app-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
        }
        
        .app-title {
          font-family: 'Courier Prime', monospace;
          font-size: 2.8rem;
          font-weight: bold;
          margin: 0;
          position: relative;
          display: inline-block;
          color: #333;
        }
        
        .app-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 4px;
          background: #333;
          opacity: 0.15;
        }
        
        .app-subtitle {
          font-family: 'Courier Prime', monospace;
          color: #666;
          margin: 0.75rem 0 0;
          font-size: 1.1rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          transition: background-color 0.2s;
        }

        .card-header:hover {
          background-color: #f9f9f9;
        }

        .card-title {
          font-family: 'Courier Prime', monospace;
          font-size: 1.25rem;
          margin: 0;
          font-weight: 600;
          color: #333;
        }

        .expand-icon {
          font-size: 0.8rem;
          color: #666;
        }

        .fullscreen-dropdown {
          position: relative;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          top: 100%;
          background-color: #fff;
          min-width: 320px;
          max-height: 400px;
          overflow-y: auto;
          border-radius: 12px;
          z-index: 100;
          padding: 1.25rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .dropdown-task-input {
          padding-top: 1.25rem;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
          margin-top: 1.25rem;
        }

        .fullscreen-dropdown:hover .dropdown-content {
          display: block;
        }
        
        /* Responsive styles */
        @media (max-width: 600px) {
          .container {
            padding: 1.25rem 1rem;
          }
          
          .app-title {
            font-size: 2.2rem;
          }
          
          .app-subtitle {
            font-size: 1rem;
          }
          
          .timer-fullscreen-wrapper {
            max-width: 100%;
            padding-top: 1rem;
          }
          
          .current-task-name {
            max-width: 120px;
          }
        }

        .fullscreen-controls {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.5rem;
        }
        
        .fullscreen-task-btn {
          background: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          transition: all 0.2s;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 200px;
          text-align: left;
        }

        .fullscreen-task-btn:hover {
          background: #f0f0f0;
        }

        .current-task-dropdown {
          position: relative;
        }
        
        .task-selection {
          min-width: 250px;
          padding: 0.5rem;
        }
        
        .dropdown-title {
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          margin: 0 0 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .task-selection-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .task-selection-item {
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.25rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .task-selection-item:hover {
          background-color: #f5f5f5;
        }
        
        .task-selection-item.active {
          background-color: #333;
          color: white;
        }
        
        .no-tasks-message {
          padding: 0.75rem;
          text-align: center;
          color: #666;
          font-family: 'Courier Prime', monospace;
          font-style: italic;
        }
        
        .current-task-dropdown:hover .dropdown-content,
        .fullscreen-dropdown:hover .dropdown-content {
          display: block;
        }

        .card-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .edit-settings-btn {
          background: #fff;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 0.3rem 0.75rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .edit-settings-btn:hover {
          background: #f5f5f5;
        }
      `}</style>
    </main>
  );
}
