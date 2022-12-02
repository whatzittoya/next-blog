import { GraphQLClient, gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
// import { GraphQLClient, gql } from "graphql-request";
import { getPosts } from "../../services/strapi_gql";
import transformJSON from "../../src/lib/transformJSON";
type Data = {
  name: string;
};

const graphqlAPI = process.env.STRAPI_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const graphQLClient = new GraphQLClient(graphqlAPI);
  graphQLClient.setHeader(
    "authorization",
    "Bearer 2f8edc3bc1b03722c2c1f3486689741f87e4932c709edb42ddcf264a3555bf0d1092c2a6b1eb92ca9ff2f9c000f979997739bf312a4b200b5879d4f82c6698be379a1a879dd2ceba7488117e69954d54808a00c992e3ec4e2ede0a550672f939fd636dea00ecce944d6aa436b3356929310a03b08ac82c04ccd4001e84735969"
  );
  const query = gql`
    query getPosts {
      posts {
        data {
          id
          attributes {
            Title
            Categories {
              data {
                id
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
  const query1 = gql`
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

  const result = await graphQLClient.request(query1);

  // const res_map = result.posts.data.map((data) => ({
  //   Title: data.attributes.Title,
  //   Categories: data.attributes.Categories.data.map((cat) => cat.attributes),
  //   Author: data.attributes.Author.data.attributes,
  // }));

  // return res.status(200).send(result.posts.data);

  const reformattedArray = result.posts.data.map((value) => {
    const transformData = (value, isarr = false) => {
      let res;
      let res_arr = [];
      let stat = "";
      Object.keys(value).forEach((e) => {
        // console.log(`key=${e}  value=${value[e]}`);

        if (e === "attributes") {
          const attr = value.attributes;
          // if (typeof value[e] === "object") {
          //   res = { ...res, ...transformData(value[e]) };
          // } else {
          //   res = { ...res, [e]: value[e] };
          // }
          res = { ...res, ...transformData(attr) };
        } else if (e === "data") {
          const attr = value.data;
          console.log(value[e]);
          if (value[e].constructor.name == "Array") {
            stat = "arr";
            res = transformData(attr, true);
          } else if (value[e].constructor.name == "Object") {
            res = { ...res, ...transformData(attr) };
          }
        } else {
          //check the value of member is object
          if (value[e].constructor.name == "Array") {
            res = [res, ...transformData(value[e])];
          } else if (value[e].constructor.name == "Object") {
            if (isarr) {
              res_arr = [...res_arr, transformData(value[e])];
            } else {
              res = { ...res, [e]: transformData(value[e]) };
            }
          } else {
            res = { ...res, [e]: value[e] };
          }
          //res = { ...res, [e]: value[e] };
        }
      });
      // console.log(res);
      if (res_arr.length > 0) {
        return res_arr;
      }

      return res;
    };

    //const key_name: string[] = Object.keys(value);

    return transformData(value);
  });

  const res_strapi = await getPosts();
  const transformed = transformJSON(res_strapi.posts);
  return res.status(200).send(transformed);
}
