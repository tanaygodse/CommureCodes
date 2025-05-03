// 5. PatientDetail.tsx (updated with better layout)
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { usePatientTasks } from '../context/PatientTaskContext';
import { format } from 'date-fns';

export default function PatientDetail() {
  const { id } = useParams();
  const { patients } = usePatients();
  const { tasks, addTask, markTaskDone } = usePatientTasks();
  const patient = patients.find((p) => p.id === id);
  const patientTasks = tasks.filter((t) => t.patientId === id);

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    task: '',
    dosage: '',
    startDate: '',
    endDate: '',
    frequency: '',
  });

  if (!patient) return <p className="text-red-600">Patient not found</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ ...form, patientId: patient.id });
    setForm({ task: '', dosage: '', startDate: '', endDate: '', frequency: '' });
    setFormVisible(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      {/* Patient Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-blue-700">{patient.name}</h1>
        <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
      </div>

      {/* Toggle Add Task */}
      <div className="mb-6">
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {formVisible ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Add Task Form */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
          <input type="text" placeholder="Task" value={form.task} onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))} className="border p-2 w-full rounded" required />
          <input type="text" placeholder="Dosage" value={form.dosage} onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))} className="border p-2 w-full rounded" />
          <input type="text" placeholder="Frequency" value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))} className="border p-2 w-full rounded" />
          <div className="flex gap-4">
            <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="border p-2 w-full rounded" />
            <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="border p-2 w-full rounded" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Task</button>
        </form>
      )}

      {/* Task List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        {patientTasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {patientTasks.map((task) => (
              <li key={task.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="font-semibold text-blue-700">{task.task}</div>
                <div className="text-sm text-gray-600">{task.dosage} | {task.frequency}</div>
                <div className="text-sm text-gray-500">
                  {task.startDate} → {task.endDate}
                </div>
                <button
                  onClick={() => markTaskDone(task.id, today)}
                  className={`mt-2 text-sm ${
                    task.completedDates.includes(today)
                      ? 'text-green-600 cursor-not-allowed'
                      : 'text-blue-600 hover:underline'
                  }`}
                  disabled={task.completedDates.includes(today)}
                >
                  {task.completedDates.includes(today) ? '✔ Done for today' : 'Mark done for today'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
