import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {
    ApolloGateway,
    GraphQLDataSourceProcessOptions,
    IntrospectAndCompose,
    RemoteGraphQLDataSource
} from '@apollo/gateway';
import { ResponsePath } from '@apollo/query-planner';
import { GatewayCacheHint, GatewayCachePolicy, GatewayGraphQLRequest, GatewayGraphQLRequestContext, GatewayGraphQLResponse } from '@apollo/server-gateway-interface';

const supergraphSdl = new IntrospectAndCompose({
    subgraphs: [
        {name: 'departments', url: 'http://localhost:4001'},
        {name: 'employees', url: 'http://localhost:4002'},
    ],
});

class DebugDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request }: GraphQLDataSourceProcessOptions<Record<string, any>>): void | Promise<void> {
        console.log(`Operation name: ${request.operationName}`);
        console.log(`Query body: ${request.query}`);
    }
    didReceiveResponse(requestContext: Required<Pick<GatewayGraphQLRequestContext<Record<string, any>>, "request" | "response" | "context">> & {
        pathInIncomingRequest?: ResponsePath
    }): GatewayGraphQLResponse | Promise<GatewayGraphQLResponse> {
        console.log(`Response body: ${requestContext?.response?.data}`);
        return requestContext.response;
    }
}
const gateway = new ApolloGateway({
    debug: true,
    supergraphSdl,
    buildService({ url }) {
        return new DebugDataSource({ url });
    },
});

const server = new ApolloServer({
    gateway,
});

const {url} = await startStandaloneServer(server, {
    listen: {port: 4000},
});

console.log(`🚀  Server ready at ${url}`);
