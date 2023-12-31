import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import gql from 'graphql-tag';
import {buildSubgraphSchema} from '@apollo/subgraph';

const typeDefs = gql`
    extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5",
        import: ["@key"])

    type Department {
        id: ID!
        name: String
        employees: [Employee!]!
    }

    type Query {
        departments: [Department]
    }

    type Employee @key(fields: "id") {
        id: ID!
    }
`;

type Department = {
    id: number;
    name: string;
    employeeIds: number[];
};

const departments: Department[] = [
    {
        id: 1,
        name: 'Finance',
        employeeIds: [1, 2, 3],
    },
    {
        id: 2,
        name: 'Happiness',
        employeeIds: [6, 7, 8]
    },
];

const resolvers = {
    Query: {
        departments: () => departments,
    },
    Department: {
        employees: (department: Department) => department.employeeIds.map(id => ({id})),
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs, resolvers}),
});

const {url} = await startStandaloneServer(server, {
    listen: {port: 4001},
});

console.log(`🚀  Departments Server ready at: ${url}`);
