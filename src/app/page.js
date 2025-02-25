"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { apiClient } from "./lib/apiClient";
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from "@tanstack/react-table";

const selectedStarshipsAtom = atom([]);

export default function StarshipsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["starships"],
    queryFn: async () => {
      const response = await apiClient.getStarships({});
      return response.body.results;
    },
    staleTime: 60000, 
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [hyperdriveFilter, setHyperdriveFilter] = useState("");
  const [crewFilter, setCrewFilter] = useState("");
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);
  const router = useRouter();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(starship => {
      const hyperdrive = parseFloat(starship.hyperdrive_rating) || 0;
      const crew = parseInt(starship.crew.replace(/,/g, ""), 10) || 0;
      const nameMatches = starship.name.toLowerCase().includes(searchQuery.toLowerCase());
      const hyperdriveMatches = !hyperdriveFilter || 
        (hyperdriveFilter === "<1.0" && hyperdrive < 1.0) ||
        (hyperdriveFilter === "1.0-2.0" && hyperdrive >= 1.0 && hyperdrive <= 2.0) ||
        (hyperdriveFilter === ">2.0" && hyperdrive > 2.0);
      const crewMatches = !crewFilter || 
        (crewFilter === "1-5" && crew >= 1 && crew <= 5) ||
        (crewFilter === "6-50" && crew >= 6 && crew <= 50) ||
        (crewFilter === "50+" && crew > 50);
      return nameMatches && hyperdriveMatches && crewMatches;
    });
  }, [data, searchQuery, hyperdriveFilter, crewFilter]);

  const toggleSelection = (starship) => {
    setSelectedStarships(prev => {
      const isSelected = prev.some(s => s.name === starship.name);
      if (isSelected) {
        return prev.filter(s => s.name !== starship.name);
      } else if (prev.length < 3) {
        return [...prev, starship];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedStarships.length >= 2) {
      router.push("/comparison");
    }
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("model", { header: "Model" }),
    columnHelper.accessor("manufacturer", { header: "Manufacturer" }),
    columnHelper.accessor("crew", { header: "Crew Size" }),
    columnHelper.accessor("hyperdrive_rating", { header: "Hyperdrive Rating" }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="text-yellow-400 text-center text-xl">Loading starships...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">Error: {error.message}</p>;

  return (
    <div className="p-6 min-h-screen bg-black text-yellow-400 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">Starships</h1>
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="p-3 border border-yellow-400 bg-gray-900 text-yellow-300 rounded focus:ring-2 focus:ring-yellow-400"
        />
        <select value={hyperdriveFilter} onChange={e => setHyperdriveFilter(e.target.value)} 
          className="p-3 border border-yellow-400 bg-gray-900 text-yellow-300 rounded focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Hyperdrive Ratings</option>
          <option value="<1.0">&lt;1.0</option>
          <option value="1.0-2.0">1.0 - 2.0</option>
          <option value=">2.0">&gt;2.0</option>
        </select>
        <select value={crewFilter} onChange={e => setCrewFilter(e.target.value)} 
          className="p-3 border border-yellow-400 bg-gray-900 text-yellow-300 rounded focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Crew Sizes</option>
          <option value="1-5">1-5</option>
          <option value="6-50">6-50</option>
          <option value="50+">50+</option>
        </select>
        <button 
          onClick={handleCompare} 
          disabled={selectedStarships.length < 2} 
          className={`p-3 rounded text-black font-bold ${selectedStarships.length < 2 ? "bg-gray-600" : "bg-yellow-400"}`}
        >
          Compare
        </button>
      </div>
      <table className="min-w-full border border-yellow-400">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 border-b border-yellow-400">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
              <th>Select</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 border-b border-yellow-400">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
              <td>
                <input type="checkbox" onChange={() => toggleSelection(row.original)} checked={selectedStarships.some(s => s.name === row.original.name)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
