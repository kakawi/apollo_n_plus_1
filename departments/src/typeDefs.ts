import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key"])

  type Department @key(fields: "id") {
    id: ID!
    name: String
    employees: [Employee!]!
  }

  type Query {
    departments: [Department]
  }

  type Employee @key(fields: "id", resolvable: false) {
    id: ID!
  }
`;
