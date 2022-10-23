import { GraphQLClient, gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
// import { GraphQLClient, gql } from "graphql-request";

type Data = {
  name: string;
};

const graphqlAPI = process.env.STRAPI_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const graphQLClient = new GraphQLClient(graphqlAPI);
  const query = gql`
    query getPosts {
      posts {
        data {
          attributes {
            Title
            Categories {
              data {
                attributes {
                  Name
                }
              }
            }
            Author {
              data {
                attributes {
                  Name
                }
              }
            }
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query);
  const res_map = result.posts.data.map((data) => ({
    Title: data.attributes.Title,
    Categories: data.attributes.Categories.data.map((cat) => cat.attributes),
    Author: data.attributes.Author.data.attributes,
  }));
  return res.status(200).send(res_map);
}
