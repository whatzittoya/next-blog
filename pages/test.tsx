// index.tsx
import { FC } from "react";
import { GetPostsQuery, useGetPostsQuery } from "../src/generated/graphql";
import graphqlRequestClient from "../src/lib/clients/graphqlRequestCLient";
import transformJSON from "../src/lib/transformJSON";
const GqlRequestQuery: FC = () => {
  const { isLoading, error, data } = useGetPostsQuery<GetPostsQuery, Error>(
    graphqlRequestClient,
    {}
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Boom boy{error.message}</p>;
  const posts = transformJSON(data?.posts);

  return (
    <>
      {posts.map((post) => {
        return (
          <div key={post?.id}>
            <h1>{post?.title}</h1>
          </div>
        );
      })}
    </>
  );
};

export default GqlRequestQuery;
