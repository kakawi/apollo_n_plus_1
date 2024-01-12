import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import gql from 'graphql-tag';
import {buildSubgraphSchema} from '@apollo/subgraph';

const typeDefs = gql`
    type Post {
        id: ID!
        title: String!
        text: String!
        comments: [Comment!]
    }

    type Comment {
        id: ID!
        text: String!
    }

    type Query {
        posts: [Post!]
    }
`;

type Post = {
    id: number;
    title: string;
    text: string;
};

const posts: Post[] = [
    {
        id: 1,
        title: 'Post#1',
        text: 'lorum ipsum',
    },
    {
        id: 2,
        title: 'Post#2',
        text: 'e pluribus unum',
    },
    {
        id: 3,
        title: 'Post#3',
        text: 'dolor sit amet',
    },
];

const comments = [
    {
        id: 34243,
        text: 'comment#1_1',
        post_id: 1,
    },
    {
        id: 9384,
        text: 'comment#1_2',
        post_id: 1,
    },
    {
        id: 34,
        text: 'comment#2_1',
        post_id: 2,
    },
    ,
    {
        id: 83,
        text: 'comment#2_2',
        post_id: 2,
    },
];

const resolvers = {
    Query: {
        posts: () => posts,
    },
    Post: {
        comments: (post: Post) => {
            console.log('Post.comments', post);
            return comments.filter(c => c.post_id === post.id);
        },
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs, resolvers}),
});

const {url} = await startStandaloneServer(server, {
    listen: {port: 4044},
});

console.log(`🚀  Employees Server ready at: ${url}`);
