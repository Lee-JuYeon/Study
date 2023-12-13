const {
    ApolloServer,
    gql,
    AuthenticationError,
    ForbiddenError,
} = require("apollo-server"); // graphql server instance 생성.
const jwt = require("jsonwebtoken");
const postgraphile = require('./db/postgraphile'); // postgraphile이란 kotlin의 room과 같이 매핑하는 도구이다.

const customTypeDefs = require('./db/typeDefs/typeDefs');
const customResolvers = require('./db/resolvers/resolvers');

const formatError = (err) => {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
    return err;
};

const server = new ApolloServer({
    customTypeDefs,
    customResolvers,
    context: ({ req }) => {
      // if (!req.headers.authorization)
      //   throw new AuthenticationError("empty token");
      if (!req.headers.authorization) return { user: undefined };
  
      const token = req.headers.authorization.substr(7);
      const user = users.find(user => user.token === token);
      // if (!user) throw new AuthenticationError("invalid token");
      return { user };
    },
    formatError,
    debug: false, /// 서버에서 에러가 발생했을때 클라이언테에게 stacktrace까지 제공하는것은 보안상 권장되지 않음.
});
  
server.listen().then(({ url }) => {
    console.log(`App.js // Listening at ${url}`);
});