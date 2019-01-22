import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isAuthenticated: Boolean!
    id: ID!
    auth_token: String!
    sessionError: String!
  }
`;

// export const resolvers = {};
