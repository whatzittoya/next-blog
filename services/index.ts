import { request, gql, GraphQLClient } from "graphql-request";
import transformJSON, { transformJSONObj } from "../src/lib/transformJSON";

const graphqlAPI = process.env.NEXT_PUBLIC_API;
const token = process.env.NEXT_PUBLIC_TOKEN;

const graphQLClient = new GraphQLClient(graphqlAPI);
graphQLClient.setHeader("authorization", `Bearer ${token}`);

export const getPosts = async () => {
  const query = gql`
    query {
      posts {
        data {
          attributes {
            Title
            Slug
            Excerpt
            FeaturedImage {
              data {
                attributes {
                  url
                }
              }
            }
            createdAt
            Author {
              data {
                id
                attributes {
                  Name
                  Bio
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
            Categories {
              data {
                attributes {
                  Name
                  Slug
                }
              }
            }
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query);
  // const res_map = result.posts.data.map((data) => ({
  //   Title: data.attributes.Title,
  //   Categories: data.attributes.Categories.data.map((cat) => cat.attributes),
  //   Author: data.attributes.Author.data.attributes,
  // }));

  return transformJSON(result.posts);
};
export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(slug: $slug) {
        data {
          attributes {
            createdAt
            Slug
            Title
            Excerpt
            FeaturedImage {
              data {
                attributes {
                  url
                }
              }
            }
            Author {
              data {
                id
                attributes {
                  Bio
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
            Categories {
              data {
                attributes {
                  Name
                  Slug
                }
              }
            }
            Content
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query, { slug });

  return transformJSONObj(result.post);
};
export const getRecentPosts = async () => {
  const query = gql`
    query {
      posts(sort: "createdAt:desc", pagination: { start: 0, limit: 3 }) {
        data {
          attributes {
            Title
            FeaturedImage {
              data {
                attributes {
                  url
                }
              }
            }
            createdAt
            Slug
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query);

  return transformJSON(result.posts);
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails(
      $slug: String! = "new-post"
      $categories: [String!] = ["Suhu", "Gaya"]
    ) {
      posts(
        filters: {
          Slug: { ne: $slug }
          Categories: { Name: { in: $categories } }
        }
      ) {
        data {
          attributes {
            Title
            FeaturedImage {
              data {
                attributes {
                  url
                }
              }
            }
            createdAt
            Slug
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query, { categories, slug });
  return transformJSON(result.posts);
};

export const getCategories = async () => {
  const query = gql`
    query getCategories {
      categories {
        data {
          attributes {
            Name
            Slug
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query);
  return transformJSON(result.categories);
};

export const submitComment = async (obj) => {
  const result = await fetch(`/api/comments`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  return transformJSON(result.json());
};

export const getComments = async (slug) => {
  const query = gql`
    query getComments($slug: String!) {
      comments(filters: { Post: { Slug: { eq: $slug } } }) {
        data {
          attributes {
            Name
            createdAt
            Comment
          }
        }
      }
    }
  `;
  const result = await graphQLClient.request(query, { slug });
  return transformJSON(result.comments);
};

export const getFeaturedPosts = async () => {
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

  const result = await graphQLClient.request(query);

  return transformJSON(result.posts);
};

export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: { categories_some: { slug: $slug } }) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await graphQLClient.request(query, { slug });

  return transformJSON(result.postsConnection.edges);
};
