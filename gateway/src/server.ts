import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {ApolloGateway, IntrospectAndCompose} from '@apollo/gateway';

const supergraphSdl = new IntrospectAndCompose({
    subgraphs: [
        {name: 'departments', url: 'http://localhost:4001'},
        {name: 'employees', url: 'http://localhost:4002'},
    ],
});

const gateway = new ApolloGateway({
    supergraphSdl,
});

const server = new ApolloServer({
    gateway,
});

const {url} = await startStandaloneServer(server, {
    listen: {port: 4000},
});

console.log(`🚀  Server ready at ${url}`);
