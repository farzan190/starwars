"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./lib/apiClient";
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from '@tanstack/react-table';

export default function StarshipsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["starships"],
    queryFn: async () => {
      const response = await apiClient.getStarships({});
      return response.body.results;
    },
    staleTime: 60000, // Prevents excessive re-fetching
  });

  const [hyperdriveFilter, setHyperdriveFilter] = useState("");
  const [crewFilter, setCrewFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(starship => {
      const hyperdrive = parseFloat(starship.hyperdrive_rating) || 0;
      const crew = parseInt(starship.crew.replace(/,/g, ""), 10) || 0;
    
      const hyperdriveMatches = 
        !hyperdriveFilter || 
        (hyperdriveFilter === "<1.0" && hyperdrive < 1.0) ||
        (hyperdriveFilter === "1.0-2.0" && hyperdrive >= 1.0 && hyperdrive <= 2.0) ||
        (hyperdriveFilter === ">2.0" && hyperdrive > 2.0);

      const crewMatches = 
        !crewFilter || 
        (crewFilter === "1-5" && crew >= 1 && crew <= 5) ||
        (crewFilter === "6-50" && crew >= 6 && crew <= 50) ||
        (crewFilter === "50+" && crew > 50);

      return hyperdriveMatches && crewMatches;
    });
  }, [data, hyperdriveFilter, crewFilter]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('model', {
      header: 'Model',
    }),
    columnHelper.accessor('manufacturer', {
      header: 'Manufacturer',
    }),
    columnHelper.accessor('crew', {
      header: 'Crew Size',
    }),
    columnHelper.accessor('hyperdrive_rating', {
      header: 'Hyperdrive Rating',
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading starships...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Starships</h1>
      
      <div className="mb-4 flex gap-4">
        <select value={hyperdriveFilter} onChange={e => setHyperdriveFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Hyperdrive Ratings</option>
          <option value="<1.0">&lt;1.0</option>
          <option value="1.0-2.0">1.0 - 2.0</option>
          <option value=">2.0">&gt;2.0</option>
        </select>
        
        <select value={crewFilter} onChange={e => setCrewFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Crew Sizes</option>
          <option value="1-5">1-5</option>
          <option value="6-50">6-50</option>
          <option value="50+">50+</option>
        </select>
      </div>
      
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
