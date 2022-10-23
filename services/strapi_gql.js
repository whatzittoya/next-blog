import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

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
  const result = await request(graphqlAPI, query);
  return result.posts.data.attribute;
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
  const result = await request(graphqlAPI, query, { slug });
  return result.post;
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
  const result = await request(graphqlAPI, query);

  return result.posts;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query, { categories, slug });
  return result.posts;
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
  const result = await request(graphqlAPI, query);
  return result.categories;
};

export const submitComment = async (obj) => {
  const result = await fetch(`/api/comments`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  return result.json();
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
  const result = await request(graphqlAPI, query, { slug });
  return result.comments;
};

export const getFeaturedPosts = async () => {
  const query = gql`
    query GetCategoryPost() {
      posts(where: {featuredPost: true}) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

  const result = await request(graphqlAPI, query);

  return result.posts;
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

  const result = await request(graphqlAPI, query, { slug });

  return result.postsConnection.edges;
};
