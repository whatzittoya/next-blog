import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import transformJSON from "../src/lib/transformJSON";

export const getFeaturedPosts = async () => {
  const cache = new InMemoryCache();
  const graphqlAPI = process.env.NEXT_PUBLIC_API;
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const httpLink = createHttpLink({
    uri: graphqlAPI,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });
  const query = gql`
    query {
      posts(filters: { FeaturedPost: { eq: true } }) {
        data {
          attributes {
            Author {
              data {
                attributes {
                  Name
                  Photo {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
            FeaturedImage {
              data {
                attributes {
                  url
                }
              }
            }
            Title
            Slug
            createdAt
          }
        }
      }
    }
  `;

  const client = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });

  const result = await client.query({
    query,
  });
  return transformJSON(result.data.posts);
};
