import { GraphQLClient } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_API as string;
const token = process.env.NEXT_PUBLIC_TOKEN;

const requestHeader = {
  authorization: `Bearer ${token}`,
};

const graphqlRequestClient = new GraphQLClient(graphqlAPI, {
  headers: requestHeader,
});

export default graphqlRequestClient;
