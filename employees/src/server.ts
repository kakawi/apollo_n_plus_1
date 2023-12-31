import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import gql from 'graphql-tag';
import {buildSubgraphSchema} from '@apollo/subgraph';

const typeDefs = gql`
    extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5",
        import: ["@key"])

    type Employee @key(fields: "id") {
        id: ID!
        firstName: String!
        lastName: String!
        department: Department!
    }

    type Department @key(fields: "id", resolvable: false) {
        id: ID!
    }

    type Query {
        employees: [Employee!]!
    }
`;

type Employee = {
    id: number;
    firstName: string;
    lastName: string;
    departmentId: number;
};

const employees: Employee[] = [
    {
        id: 1,
        firstName: 'Hleb',
        lastName: 'Bandarenka',
        departmentId: 1
    },
    {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        departmentId: 1
    },
    {
        id: 3,
        firstName: 'Jane',
        lastName: 'Buck',
        departmentId: 1
    },

    {
        id: 6,
        firstName: 'Alex',
        lastName: 'Rogers',
        departmentId: 2
    },
    {
        id: 7,
        firstName: 'Mary',
        lastName: 'Poppins',
        departmentId: 2
    },
    {
        id: 8,
        firstName: 'Bob',
        lastName: 'Uncle',
        departmentId: 2
    }
];

const resolvers = {
    Query: {
        employees: () => employees,
    },
    Employee: {
        __resolveReference: (employee: Employee) => {
            return employees.find(e => e.id === +employee.id)
        },
        department: (employee: Employee) => {
            return {id: employee.departmentId}
        },
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs, resolvers}),
});

const {url} = await startStandaloneServer(server, {
    listen: {port: 4002},
});

console.log(`🚀  Employees Server ready at: ${url}`);
