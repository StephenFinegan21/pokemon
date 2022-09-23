import type { NextPage } from "next";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";


export default function Home() {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [first, second] = pokemonIds;

  const firstPokemon = trpc.useQuery(["getPokemonById", { id: first }]);
  const secondPokemon = trpc.useQuery(["getPokemonById", { id: second }]);

  const voteMutation = trpc.useMutation(["cast-vote"])

  useEffect(() => {
    setPokemonIds(getOptionsForVote());
  }, []);

  if (!firstPokemon.data || !secondPokemon.data) {
    return <div>Loading...</div>;
  }
  //console.log(firstPokemon.data)

  const voteForRoundest = (vote: number, name: string) => {
    if(vote === first){
      voteMutation.mutate({votedFor : first, votedAgainst : second})
    }
    else{
      voteMutation.mutate({votedFor : second, votedAgainst : first})

    }
    setPokemonIds(getOptionsForVote());
  };


  return (
    <div className="h-screen w-screen flex flex-col justify-center max-w-md m-auto">
      <div className="text-center">Which Pokemon is Rounder?</div>
      <div className="border rounded p-8 flex justify-between">
        <div>
          {!firstPokemon.isLoading && !secondPokemon.isLoading &&(
            <>
              <Pokemon
                name={firstPokemon.data.name}
                sprite={firstPokemon.data.sprite}
                vote={() => voteForRoundest(first, firstPokemon.data?.name)}
              />
            </>
          )}
        </div>
        <div>
          {secondPokemon.data && (
            <>
              <Pokemon
                name={secondPokemon.data.name}
                sprite={secondPokemon.data.sprite}
                vote={() => voteForRoundest(second, secondPokemon.data?.name)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

type generatedPokemon = {
  name: string | null;
  sprite: string | null;
  vote: () => void;
};

const Pokemon = (props: generatedPokemon) => {
  console.log(props);
  const { name, sprite } = props;

  return (
    <div className=" flex flex-col justify-center items-center">
     
     
      <img className="w-32 h-32" src={sprite ? sprite : ""} />
      <p className="capitalize">{name}</p>
      <button
        className="w-24 text-white bg-red-400 p-2 rounded-sm mt-4"
        onClick={() => props.vote()}
      >
        Vote
      </button>
         
    </div>
  );
};
