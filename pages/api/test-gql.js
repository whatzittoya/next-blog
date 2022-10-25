import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export default async function handler(req, res) {
  const cache = new InMemoryCache();
  const graphqlAPI = process.env.STRAPI_API;

  const httpLink = createHttpLink({
    uri: graphqlAPI,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjY2NjgzMzMyLCJleHAiOjE2NjkyNzUzMzJ9.NgNoA6rj5jZQ75udMpAgp8t_ZQuqNhjBKpbVbhj7ZfI",
      },
    };
  });

  //   const link = new HttpLink({
  //     uri: graphqlAPI,
  //   });
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

  const client = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });
  client
    .query({
      query,
    })
    .then((result) => res.status(200).send(result));
}
