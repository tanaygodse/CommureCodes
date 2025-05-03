import React from 'react';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from '../context/AppointmentContext';

export default function Dashboard() {
  const { appointments } = useAppointments();
  const today = new Date();
  const pendingAppointments = appointments.filter(
  (apt) =>
    apt.status === 'pending' &&
    format(new Date(apt.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
          <div className="text-3xl font-bold text-blue-600">
            {pendingAppointments.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{appointment.patientName}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {format(appointment.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {appointment.startTime}
                  </div>

                </div>
                {appointment.notes && (
                  <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}