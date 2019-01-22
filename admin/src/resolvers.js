import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isAuthenticated: Boolean!
    admin_user: String!
    admin_token: String!
    sessionError: String!
  }
`;
