import { client } from "@/utils/client";
import { NextApiRequest, NextApiResponse } from "next";
import { allUsersQuery } from "@/utils/queries";
import { uuid } from "uuidv4";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = await client.fetch(allUsersQuery());

    if (data) {
      res.status(200).json(data);
    } else {
      res.json([]);
    }
  } else if (req.method === "PUT") {
    const { userId, creatorId, follow } = req.body;

    if (follow) {
      //update creator
      const updateCreator = await client
        .patch(creatorId)
        .setIfMissing({ follower: [] })
        .insert("after", "follower[-1]", [
          { _key: uuid(), _ref: userId, _type: "postedBy" },
        ])
        .commit();

      // update user
      const updateUser = await client
        .patch(userId)
        .setIfMissing({ following: [] })
        .insert("after", "following[-1]", [
          { _key: uuid(), _ref: creatorId, _type: "postedBy" },
        ])
        .commit();

      const data = await Promise.all([updateCreator, updateUser]);
      res.status(200).json(data);
    } else {
      // update creator
      const updateCreator = await client
        .patch(creatorId)
        .unset([`follower[_ref=="${userId}"]`])
        .commit();

      // update user
      const updateUser = await client
        .patch(userId)
        .unset([`following[_ref=="${creatorId}"]`])
        .commit();

      const data = await Promise.all([updateCreator, updateUser]);
      res.status(200).json(data);
    }
  }
}
