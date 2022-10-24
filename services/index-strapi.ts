import { GraphQLClient, gql } from "graphql-request";
import { getPosts } from "./strapi_gql";

export const getRecentPosts = async () => {
  const endpoint: string = process.env.STRAPI_API;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: process.env.STRAPI_TOKEN,
    },
  });

  const query = gql`
    query getPosts {
      post {
        title
      }
    }
  `;

  const data = await graphQLClient.request(query);
  console.log(endpoint);
};

getRecentPosts().catch((error) => console.error(error));
