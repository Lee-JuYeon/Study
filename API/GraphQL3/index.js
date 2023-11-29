const {
     ApolloServer,
      gql
} = require("apollo-server"); // graphql server instance 생성.


const typeDefs = gql`
  type Query {
    ping: String
  }
`;

const resolvers = {
  Query: {
    ping: () => "pong",
  },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
server.listen().then(({ url }) => {
    console.log(`Listening at ${url}`);
});