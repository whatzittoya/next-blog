import type { NextApiRequest, NextApiResponse } from "next";
import { GetPostsQuery, useGetPostsQuery } from "../../src/generated/graphql";
import graphqlRequestClient from "../../src/lib/clients/graphqlRequestCLient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { isloading, error, data } = useGetPostsQuery<GetPostsQuery, Error>(
    graphqlRequestClient,
    {}
  );

  if (isloading) return;

  return res.status(200).send(data);
}
