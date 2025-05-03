import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';

const appointmentSchema = z
  .object({
    patientId: z.string().min(1, 'Patient is required'),
    appointmentType: z.enum(['blood_test', 'vaccination']),
    date: z.date(),
    notes: z.string().optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.startTime.split(':').map(Number);
      const [endH, endM] = data.endTime.split(':').map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return end > start;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  selectedDate: Date;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  patients: Array<{ _id: string; name: string }>;
}

export default function AppointmentForm({
  selectedDate,
  onSubmit,
  onCancel,
  patients,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate,
    },
  });

  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: p.name,
  }));

  const handlePatientChange = (selected: any) => {
    setValue('patientId', selected?.value || '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Searchable Patient Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
        <Select
          options={patientOptions}
          onChange={handlePatientChange}
          placeholder="Search patient..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
        )}
      </div>

      {/* Appointment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
        <select
          {...register('appointmentType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="blood_test">Blood Test</option>
          <option value="vaccination">Vaccination</option>
        </select>
      </div>

      {/* Time Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            {...register('startTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            {...register('endTime')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Appointment
        </button>
      </div>
    </form>
  );
}
