"use client";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { selectedStarshipsAtom } from "../atoms/starshipAtom";
import { useRouter } from "next/navigation";

export default function ComparePage() {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);
  const router = useRouter();


  console.log(selectedStarships);

  return (
    <div className="p-6 min-h-screen bg-black text-yellow-400 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">Compare Starships</h1>
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedStarships.map((starship) => (
          <div key={starship.name} className="border border-yellow-400 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{starship.name}</h2>
            <p><span className="font-semibold">Model:</span> {starship.model}</p>
            <p><span className="font-semibold">Manufacturer:</span> {starship.manufacturer}</p>
            <p><span className="font-semibold">Crew:</span> {starship.crew}</p>
            <p><span className="font-semibold">Hyperdrive Rating:</span> {starship.hyperdrive_rating}</p>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/")} className="mt-6 block mx-auto p-3 border border-yellow-400 bg-yellow-500 text-black rounded">
        Back
      </button>
    </div>
  );
}
