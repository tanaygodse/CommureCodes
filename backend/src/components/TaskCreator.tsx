import React, { useState } from 'react';

export default function TaskCreator({ patients }: { patients: any[] }) {
  const [prompt, setPrompt] = useState('');
  const [parsedTask, setParsedTask] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/parse-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setParsedTask(data);
    setLoading(false);
  };

  const handleSave = async () => {
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId || !selectedPatient) return alert("Select doctor/patient");

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsedTask,
        patientId: selectedPatient,
        doctorId
      })
    });
    alert("✅ Task saved");
    setParsedTask(null);
    setPrompt('');
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Doctor Task Instruction</h2>

      <textarea
        className="w-full border p-2 mb-4"
        rows={3}
        placeholder="e.g., Ask Riya to take Crocin twice daily for 5 days starting tomorrow"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleParse}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Parsing..." : "Parse Task"}
      </button>

      {parsedTask && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">🧠 Task Extracted:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(parsedTask, null, 2)}
          </pre>

          <label className="block mt-4 mb-2 text-sm">Select Patient</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Task
          </button>
        </div>
      )}
    </div>
  );
}
