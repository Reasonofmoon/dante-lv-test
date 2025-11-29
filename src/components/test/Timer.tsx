import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

interface TimerProps {
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, setTimeRemaining, onTimeUp, isActive }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeRemaining, onTimeUp, setTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={clsx(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-xl transition-all",
      timeRemaining < 60 ? "bg-red-500 text-white animate-pulse" : 
      timeRemaining < 180 ? "bg-yellow-500 text-white" : "bg-white/20 text-white backdrop-blur-sm"
    )}>
      <Clock className="w-5 h-5" />
      {formatTime(timeRemaining)}
    </div>
  );
};

export default Timer;
