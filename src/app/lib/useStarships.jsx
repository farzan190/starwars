import { useQuery } from "@tanstack/react-query";

const fetchStarships = async () => {
  const response = await fetch("https://swapi.dev/api/starships/");
  if (!response.ok) throw new Error("Failed to fetch starships");
  return response.json();
};

export const useStarships = () => {
  return useQuery({ queryKey: ["starships"], queryFn: fetchStarships });
};
