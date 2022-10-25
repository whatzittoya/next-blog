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
  const graphQLClient = new GraphQLClient(graphqlAPI, {
    Headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjY2NjgzMzMyLCJleHAiOjE2NjkyNzUzMzJ9.NgNoA6rj5jZQ75udMpAgp8t_ZQuqNhjBKpbVbhj7ZfI",
    },
  });

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

  const login = gql`
    mutation {
      login(
        input: { identifier: "visita@gmail.com", password: "123Comment." }
      ) {
        jwt
      }
    }
  `;
  // const registql=gql`mutation {
  // register(input: { username: "username", email: "email", password: "password" }) {
  //   jwt
  //   user {
  //     username
  //     email
  //   }
  // }
  // }`

  const result = await graphQLClient.request(query);
  // const res_map = result.posts.data.map((data) => ({
  //   Title: data.attributes.Title,
  //   Categories: data.attributes.Categories.data.map((cat) => cat.attributes),
  //   Author: data.attributes.Author.data.attributes,
  // }));
  return res.status(200).send(result);
}
