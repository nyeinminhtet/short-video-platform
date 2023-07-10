import { client } from "@/utils/client";
import { NextApiRequest, NextApiResponse } from "next";
import { searchPostsQuery } from "@/utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { searchTerm } = req.query;

    const searchVideoQuery = searchPostsQuery(searchTerm);

    const videos = await client.fetch(searchVideoQuery);

    res.status(200).json(videos);
  }
}
