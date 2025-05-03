import React, { createContext, useContext, useState } from 'react';
import { Patient } from '../types';

const PatientContext = createContext<{
  patients: Patient[];
}>({ patients: [] });

export const PatientProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients] = useState<Patient[]>([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ]);

  return (
    <PatientContext.Provider value={{ patients }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => useContext(PatientContext);