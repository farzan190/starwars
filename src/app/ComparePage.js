"use client";

import { useLocation, useNavigate } from "react-router-dom";

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedStarships = location.state?.selectedStarships || [];

  if (selectedStarships.length === 0) {
    return (
      <div className="p-6 min-h-screen bg-black text-yellow-400 text-center">
        <h1 className="text-3xl font-bold mb-4">No Starships Selected</h1>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-yellow-400">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">Compare Starships</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedStarships.map((ship) => (
          <div key={ship.name} className="border border-yellow-400 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">{ship.name}</h2>
            <p><strong>Model:</strong> {ship.model}</p>
            <p><strong>Manufacturer:</strong> {ship.manufacturer}</p>
            <p><strong>Crew Size:</strong> {ship.crew}</p>
            <p><strong>Hyperdrive Rating:</strong> {ship.hyperdrive_rating}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
        >
          Back to Starships
        </button>
      </div>
    </div>
  );
}
