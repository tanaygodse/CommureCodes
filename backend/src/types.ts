export type Appointment = {
  id: string;
  patientName: string;
  appointmentType: 'blood_test' | 'vaccination';
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
};

export interface Patient {
  id: string;
  name: string;
}


export interface PatientTask {
  id: string;
  patientId: string;
  task: string;
  dosage: string;
  startDate: string;
  endDate: string;
  frequency: string;
  completedDates: string[];
}