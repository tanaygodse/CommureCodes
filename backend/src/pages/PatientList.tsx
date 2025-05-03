// 4. PatientList.tsx (enhanced with card layout)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

export default function PatientList() {
  const { patients } = usePatients();
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Select a Patient</h1>

      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-md"
      />

      {filteredPatients.length === 0 ? (
        <p className="text-gray-500">No matching patients found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPatients.map((p) => (
            <Link
              to={`/patients/${p.id}`}
              key={p.id}
              className="block p-6 bg-white rounded shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-blue-600">{p.name}</h2>
              <p className="text-sm text-gray-500">ID: {p.id}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
