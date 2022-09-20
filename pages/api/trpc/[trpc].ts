import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { PokemonClient } from 'pokenode-ts';


import { z } from 'zod';
export const appRouter = trpc
  .router()
  .query('getPokemonById', {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ input }) {
      const api = new PokemonClient();

      const Pokemon = await api.getPokemonById(input.id)
      return Pokemon
    },
  });
// export type definition of API
export type AppRouter = typeof appRouter;
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});