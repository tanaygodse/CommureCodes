import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import AppointmentForm from '../components/AppointmentForm';
import { useSpeechToText } from '../hooks/useSpeechToText';
import 'react-day-picker/dist/style.css';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState([]);
  const [appointmentsForDate, setAppointmentsForDate] = useState<any[]>([]);
  const [patients, setPatients] = useState([]);
  const [mode, setMode] = useState<'manual' | 'smart' | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const { startListening, stopListening } = useSpeechToText((text) => {
    setPrompt(text);
  });

  const handleStartListening = () => {
    setPrompt('');
    setIsListening(true);
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
  };

  const handleResetPrompt = () => {
    setPrompt('');
    setParsedData(null);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setMode(null);
    setParsedData(null);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) {
        alert("Doctor not logged in.");
        return;
      }

      const response = await fetch("http://localhost:8000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          doctorId,
          date: selectedDate.toISOString(),
          status: "Scheduled",
        }),
      });

      const result = await response.json();
      console.log("✅ Appointment inserted:", result.insertedId);
      setMode(null);
    } catch (error) {
      console.error("❌ Error submitting appointment:", error);
    }
  };

  const handleParseSmartInput = async () => {
    const res = await fetch("http://localhost:8000/parse-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setParsedData({ ...data, date: selectedDate.toISOString() });
  };

  const handleSaveParsedTask = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!parsedData.patientId || !doctorId) return alert("Select patient");

    const response = await fetch("http://localhost:8000/appointments/structured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: localStorage.getItem("doctorId"),
        patientId: parsedData.patientId,
        items: parsedData.items, 
        notes: parsedData.notes || "",
      }),
    });
  
    const result = await response.json();
    console.log("📦 Structured data saved:", result.insertedIds);
    setParsedData(null);
    setMode(null);
  };

  useEffect(() => {
    fetch("http://localhost:8000/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const dateStr = format(selectedDate, 'MM-DD-YYYY');
      const response = await fetch(`http://localhost:8000/appointments/by-date?date=${dateStr}`);
      const data = await response.json();
      console.log('data',data)
      setAppointmentsForDate(data);
    };
    fetchAppointments();
  }, [selectedDate]);

  const selectedDateAppointments = appointments.filter(
    (apt) =>
      format(new Date(apt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const appointmentDates = appointments.reduce((acc: any, apt: any) => {
    const dateStr = format(new Date(apt.date), 'yyyy-MM-dd');
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const modifiers = {
    hasAppointment: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return dateStr in appointmentDates;
    }
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && handleDayClick(date)}
            className="!w-full"
            modifiers={modifiers}
            classNames={{
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "font-bold text-blue-600",
              day: "relative cursor-pointer",
            }}
            footer={appointmentDates[format(selectedDate, 'yyyy-MM-dd')] ? (
              <div className="text-sm text-blue-600 mt-2">
                {appointmentDates[format(selectedDate, 'yyyy-MM-dd')]} appointment(s) scheduled
              </div>
            ) : null}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {appointmentsForDate.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Appointments on {format(selectedDate, 'MMMM d, yyyy')}:</h2>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {appointmentsForDate.map((apt: any, i: number) => (
                  <li key={i} className="mb-1">
                    <strong>Patient:</strong> {apt.patientId} | 
                    {apt.type?.appointments && Object.values(apt.type.appointments).map((a: any, j: number) => (
                      <span key={j}>🩺 {a.appointmentType} at {a.startTime || '?'} </span>
                    ))}
                    {apt.type?.tasks && Object.values(apt.type.tasks).map((t: any, k: number) => (
                      <span key={k}>📝 {t.task} ({t.frequency || '-'}) </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!mode && (
            <div className="flex gap-2">
              <button onClick={() => setMode('manual')} className="bg-blue-600 text-white px-4 py-2 rounded">
                Manual Form
              </button>
              <button onClick={() => setMode('smart')} className="bg-green-600 text-white px-4 py-2 rounded">
                Smart Input
              </button>
            </div>
          )}

          {mode === 'manual' && (
            <AppointmentForm
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={() => setMode(null)}
              patients={patients}
            />
          )}

          {mode === 'smart' && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handleStartListening}
                  className={`px-4 py-2 rounded ${isListening ? 'bg-red-100 text-red-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                  disabled={isListening}
                >
                  🎤 Start Speaking
                </button>
                <button
                  onClick={handleStopListening}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                  disabled={!isListening}
                >
                  🛑 Stop
                </button>
                <button
                  onClick={handleResetPrompt}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  🔄 Reset
                </button>
                {isListening && <span className="text-red-500 animate-pulse ml-2">🎙 Listening...</span>}
              </div>

              <textarea
                className="w-full p-2 border rounded mb-2"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Spoken text will appear here..."
              />

              <button
                onClick={handleParseSmartInput}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Parse
              </button>

              {parsedData && (
                <div className="mt-4 border p-4 rounded bg-gray-50">
                  <h3 className="font-semibold mb-2">Suggested Actions:</h3>
                  {parsedData.items.map((item: any, index: number) => (
                    <div key={index} className="mb-4 border-b pb-2">
                      <p><strong>Type:</strong> {item.type}</p>
                      {item.type === "Appointment" && (
                        <>
                          {Object.entries(item.appointments || {}).map(([key, val]: [string, any]) => (
                            <p key={key}><strong>{key}:</strong> {val.appointmentType} (Order {val.order})</p>
                          ))}
                          <p><strong>Start Date:</strong> {item.appointmentStartDate}</p>
                          <p><strong>End Date:</strong> {item.appointmentEndDate}</p>
                          <p><strong>Start Time:</strong> {item.startTime || 'N/A'}</p>
                          <p><strong>End Time:</strong> {item.endTime || 'N/A'}</p>
                        </>
                      )}
                      {item.type === "Task" && (
                        <>
                          {Object.entries(item.tasks || {}).map(([key, val]: [string, any]) => (
                            <p key={key}><strong>{key}:</strong> {val.task} (Order {val.order})</p>
                          ))}
                          <p><strong>Start Date:</strong> {item.taskStartDate}</p>
                          <p><strong>End Date:</strong> {item.taskEndDate}</p>
                          <p><strong>Start Time:</strong> {item.startTime || 'N/A'}</p>
                          <p><strong>End Time:</strong> {item.endTime || 'N/A'}</p>
                          <p><strong>Frequency:</strong> {item.frequency || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  ))}
                  <p className="mt-2"><strong>Notes:</strong> {parsedData.notes || "None"}</p>

                  <select
                    className="mt-2 w-full border p-2 rounded"
                    onChange={(e) => setParsedData({ ...parsedData, patientId: e.target.value })}
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleSaveParsedTask}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save Appointment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
