import { useState, KeyboardEvent } from 'react';

interface TaskInputProps {
  onAddTask: (task: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [task, setTask] = useState('');

  const handleSubmit = () => {
    if (task.trim()) {
      onAddTask(task.trim());
      setTask('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="task-input-container">
      <h2 className="section-title">Add Task</h2>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="What are you working on"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="task-input"
        />
        <button 
          onClick={handleSubmit}
          className="add-task-btn"
          aria-label="Add task"
          disabled={!task.trim()}
        >
          <span className="btn-icon">+</span>
          <span className="btn-text">Add</span>
        </button>
      </div>
      <style jsx>{`
        .task-input-container {
          margin: 1rem 0;
        }
        .section-title {
          font-family: 'Courier Prime', monospace;
          font-size: 1.25rem;
          margin: 0 0 0.75rem;
          color: #333;
        }
        .input-wrapper {
          display: flex;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .task-input {
          flex: 1;
          border: none;
          padding: 0.9rem 1.2rem;
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          outline: none;
          background: transparent;
        }
        .add-task-btn {
          border: none;
          border-left: 1px solid rgba(0, 0, 0, 0.08);
          background: #f9f9f9;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          font-family: 'Courier Prime', monospace;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
          transition: all 0.2s;
          white-space: nowrap;
          height: 100%;
        }
        .add-task-btn:hover {
          background-color: #f0f0f0;
        }
        .add-task-btn:active {
          background-color: #e8e8e8;
        }
        .add-task-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-icon {
          font-size: 1.1rem;
          font-weight: bold;
        }
        .btn-text {
          font-size: 0.95rem;
        }

        @media (max-width: 600px) {
          .add-task-btn {
            padding: 0.75rem 1rem;
          }
          .btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
} 