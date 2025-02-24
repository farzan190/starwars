import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const starshipContract = initContract()
  .router({
    getStarships: {
      method: "GET",
      path: "/starships",
      responses: {
        200: z.object({
          results: z.array(
            z.object({
              name: z.string(),
              model: z.string(),
              manufacturer: z.string(),
              crew: z.string(),
              hyperdrive_rating: z.string(),
            })
          ),
        }),
      },
    },
  });
