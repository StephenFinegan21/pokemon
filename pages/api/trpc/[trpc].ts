import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { resolve } from "path";
import { PokemonClient } from "pokenode-ts";
import { PrismaClient } from "@prisma/client";

import { z } from "zod";

const prisma = new PrismaClient()

export const appRouter = trpc.router().query("getPokemonById", {
  input: z.object({
    id: z.number()
  }),
  async resolve({ input }) {
    const api = new PokemonClient();

    const pokemon =  await api.getPokemonById(input.id)

    return { name: pokemon.name, sprite : pokemon.sprites.front_default };
  },
}) .mutation("cast-vote", {
  input: z.object({
    votedFor: z.number(),
    votedAgainst: z.number(),
  }),
  async resolve({ input }) {
    const voteInDb = await prisma.vote.create({
      data: {
        ...input
      },
    });
    return { success: true, vote: voteInDb };
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
