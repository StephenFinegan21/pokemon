import type { NextPage } from "next";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";

export default function Home() {
  const[first, setFirst] = useState<number>(0)
  const[second, setSecond] = useState<number>(0)
  
  const firstPokemonId = trpc.useQuery(['getPokemonById', { id: first }]);
  const secondPokemonId = trpc.useQuery(['getPokemonById', { id: second }]);
 
  console.log(firstPokemonId , secondPokemonId)

 useEffect(() => {
  setFirst(getOptionsForVote()[0])
  setSecond(getOptionsForVote()[1])
 }, [])

 
 if (!firstPokemonId.data || first < 1) {
  return <div>Loading...</div>;
}
  return (
    <div className="h-screen w-screen flex flex-col justify-center max-w-md m-auto">
      <div className="text-center">Which Pokemon is Rounder?</div>
      <div className="border rounded p-8 flex justify-between">
        <div className="w-32 h-32 bg-red-500 flex flex-col justify-center items-center">
          <img src={firstPokemonId.data?.sprites.front_default} />
          <p className="capitalize">{firstPokemonId.data?.name}</p>
        </div>
        <div className="w-32 h-32 bg-blue-500 flex flex-col justify-center items-center">
        <img src={secondPokemonId.data?.sprites.front_default} />
        <p className="capitalize">{secondPokemonId.data?.name}</p>
        </div>
      </div>
    </div>
  );
}
