import { useState } from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  currentTask: string | null;
  onSelectTask: (id: string) => void;
}

export default function TaskList({ 
  tasks, 
  onTaskComplete, 
  onTaskDelete, 
  currentTask,
  onSelectTask 
}: TaskListProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const activeTasks = tasks.filter(task => !task.completed);
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2 className="task-list-title">Tasks</h2>
        {completedTasks.length > 0 && (
          <button 
            className="toggle-completed-btn"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add one above! ✏️</p>
        </div>
      ) : (
        <>
          {activeTasks.length === 0 && completedTasks.length > 0 ? (
            <div className="empty-state partial">
              <p>All tasks completed! 🎉</p>
            </div>
          ) : (
            <ul className="task-list">
              {activeTasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${
                    currentTask === task.id ? 'current' : ''
                  }`}
                >
                  <div className="task-content" onClick={() => onSelectTask(task.id)}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onTaskComplete(task.id)}
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                  <div className="task-actions">
                    <span className="pomodoro-count">
                      {Array(task.pomodoros).fill('🍅').join('')}
                    </span>
                    <button 
                      onClick={() => onTaskDelete(task.id)}
                      className="delete-btn"
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {completedTasks.length > 0 && showCompleted && (
            <div className="completed-tasks-section">
              <div className="completed-divider">
                <span>Completed</span>
              </div>
              <ul className="task-list completed-list">
                {completedTasks.map((task) => (
                  <li 
                    key={task.id} 
                    className={`task-item completed ${
                      currentTask === task.id ? 'current' : ''
                    }`}
                  >
                    <div className="task-content" onClick={() => onSelectTask(task.id)}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onTaskComplete(task.id)}
                        className="task-checkbox"
                      />
                      <span className="task-text">{task.text}</span>
                    </div>
                    <div className="task-actions">
                      <span className="pomodoro-count">
                        {Array(task.pomodoros).fill('🍅').join('')}
                      </span>
                      <button 
                        onClick={() => onTaskDelete(task.id)}
                        className="delete-btn"
                        aria-label="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <style jsx>{`
        .task-list-container {
          width: 100%;
        }
        
        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed #ccc;
        }
        
        .task-list-title {
          font-family: 'Courier Prime', monospace;
          font-size: 1.25rem;
          margin: 0;
          color: #333;
        }
        
        .toggle-completed-btn {
          font-size: 0.8rem;
          background: transparent;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toggle-completed-btn:hover {
          background: #f5f5f5;
          border-color: #aaa;
        }
        
        .empty-state {
          padding: 2rem 1rem;
          text-align: center;
          font-style: italic;
          color: #666;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px dashed #ccc;
        }
        
        .empty-state.partial {
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .task-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px dashed #eee;
          transition: all 0.2s;
          border-radius: 4px;
        }
        
        .task-item:last-child {
          border-bottom: none;
        }
        
        .task-item:hover {
          background-color: #f9f9f9;
        }
        
        .task-item.current {
          background-color: #f0f8ff;
          border-left: 3px solid #007bff;
        }
        
        .task-content {
          display: flex;
          align-items: center;
          flex: 1;
          cursor: pointer;
        }
        
        .task-checkbox {
          margin-right: 0.5rem;
          cursor: pointer;
          width: 16px;
          height: 16px;
        }
        
        .task-text {
          font-family: 'Courier Prime', monospace;
          transition: all 0.2s;
        }
        
        .task-item.completed .task-text {
          text-decoration: line-through;
          color: #999;
        }
        
        .task-actions {
          display: flex;
          align-items: center;
        }
        
        .pomodoro-count {
          margin-right: 0.5rem;
          font-size: 0.85rem;
        }
        
        .delete-btn {
          border: none;
          background: none;
          color: #ccc;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          padding: 0 0.25rem;
          transition: color 0.2s;
        }
        
        .delete-btn:hover {
          color: #ff4d4d;
        }
        
        .completed-tasks-section {
          margin-top: 1.5rem;
        }
        
        .completed-divider {
          position: relative;
          text-align: center;
          margin: 1rem 0;
        }
        
        .completed-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #eee;
          z-index: 0;
        }
        
        .completed-divider span {
          position: relative;
          background: white;
          padding: 0 0.5rem;
          font-size: 0.8rem;
          color: #999;
          z-index: 1;
        }
        
        .completed-list .task-item {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
} 