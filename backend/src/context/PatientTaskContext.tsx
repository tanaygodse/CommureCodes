import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientTask } from '../types';

interface PatientTaskContextType {
  tasks: PatientTask[];
  addTask: (task: Omit<PatientTask, 'id' | 'completedDates'>) => void;
  markTaskDone: (taskId: string, date: string) => void;
}

const PatientTaskContext = createContext<PatientTaskContextType | undefined>(undefined);

export const PatientTaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<PatientTask[]>(() => {
    const stored = localStorage.getItem('patientTasks');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('patientTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<PatientTask, 'id' | 'completedDates'>) => {
    const newTask: PatientTask = {
      ...taskData,
      id: crypto.randomUUID(),
      completedDates: [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const markTaskDone = (taskId: string, date: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId && !task.completedDates.includes(date)
          ? { ...task, completedDates: [...task.completedDates, date] }
          : task
      )
    );
  };

  return (
    <PatientTaskContext.Provider value={{ tasks, addTask, markTaskDone }}>
      {children}
    </PatientTaskContext.Provider>
  );
};

export const usePatientTasks = () => {
  const context = useContext(PatientTaskContext);
  if (!context) throw new Error('usePatientTasks must be used within provider');
  return context;
};
