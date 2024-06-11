import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import gql from 'graphql-tag';
import {buildSubgraphSchema} from '@apollo/subgraph';
import Dataloader from 'dataloader';

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
        text: 'comment#3_1',
        post_id: 3,
    },
    ,
    {
        id: 83,
        text: 'comment#3_2',
        post_id: 3,
    },
];

const commentsDataloader = new Dataloader((postIds: number[]) => {
    console.log('commentsDataloader', postIds);
    const commentsMap = comments.filter(c => postIds.includes(c.post_id)).reduce((map, comment) => {
        if (!map[comment.post_id]) {
            map[comment.post_id] = [];
        }
        map[comment.post_id].push(comment);
        return map;
    }, {});
    const commentsInOrder = postIds.map(postId => commentsMap[postId] || []);
    return Promise.resolve(commentsInOrder);
});

const resolvers = {
    Query: {
        posts: () => posts,
    },
    Post: {
        comments: (post: Post) => {
            console.log('Post.comments', post);
            return commentsDataloader.load(post.id);
            // return comments.filter(c => c.post_id === post.id);
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
