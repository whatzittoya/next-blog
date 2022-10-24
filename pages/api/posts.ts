import type { NextApiRequest, NextApiResponse } from "next";
import { Result } from "postcss";
import { getPosts } from "../../services";
import { getRecentPosts } from "../../services/index-strapi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await getRecentPosts();
  return res.status(200).send(result);
}
