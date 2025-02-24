"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./lib/apiClient"; 


export default function StarshipsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["starships"],
    queryFn: async () => {
      const response = await apiClient.getStarships({});
      return response.body.results;
    },
  });

  if (isLoading) return <p>Loading starships...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Starships</h1>
      <ul className="space-y-2">
        {data?.map((ship) => (
          <li key={ship.name} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{ship.name}</h2>
            <p>Model: {ship.model}</p>
            <p>Manufacturer: {ship.manufacturer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
