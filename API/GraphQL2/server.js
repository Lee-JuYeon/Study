const { 
    ApolloServer, 
    gql, 
    ApolloError, 
    AuthenticationError 
} = require('apollo-server'); // graphql server instance 생성.
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const postgraphile = require('./db/postgraphile');
const { PORT } = process.env;

// const app = express();
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(postgraphile)
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// graphQL에는 query, mutation, subscription. 총 3가지의 operation type 있다.
// GraphQL에는 query, mutation, subscription. 총 3가지의 opration이 있다.
// query : 데이터 조회 && sever/client 모델 방식.
// mutation : 데이터 변경 && publish/subscription 방식(발행,구독)
// subscription : real-time의 데이터 조회
// subscription, 왜쓰는건데? 
// server+client모델은 클라이언에서 최신의 데이터를 받아오려면 서버를 자주 호출해야함.
// 접속자가 많은 서버에서 동시 다발적으로 변경이 발생하는 경우 클라이언트에서 서버를 자주 호출하더라도 '실시간'을 구현하기 힘듦.
// 또한, 업데이트가 자주 발생하지 않는데도 '실시간'을 구현하려고 쉴세없이 서버를 호출하는건 엄청난 코스트 낭비다.
// 이에 GraphQL은 WebSocket프로토콜을 이용하여 서버와 클라이언트를 채널 연결을 유지한채로 서버에서 발생하는 이벤트를 '실시간'으로 수신받는다.
// 우리는 이걸 'subscription'이다.
// graphQL에서는 Apollo server가 자체적으로 pub/sub엔진을 내장하고 있다.

const typeDefs = gql`
    type JobPortfolio {
        id : ID!
        userID : String
        hasJob : Bool
        workMonth : Int
        jobSkill : [String]
        portfolioURL : [String]
        certification : [String]
        languages : [String]
        education : String
        workedCompany : [WorkedCompany]
    }

    type WorkedCompany {
        userID : ID!
        companyTitle : String
        workStart : String
        workEnd : String
        position : String
    }

    type Query{
        readJobPortfolio(userID : String!)
        readJobPortfolios : [JobPortfolio]

        ping: String
        authenticate(username: String, password: String): String
        me: User
        users: [User]
    }

    type User {
        username: String!
        email: String!
    }
`;
const resolvers = {
    Query : {
        ping: () => "pong",
        authenticate: (parent, { username, password }) => {
            const found = userDB.find(
                user => user.username === username && user.password === password
            );
            console.log(found);
            return found && found.token;
        },
        me: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            return user;
        },
        allUsers: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            if (!user.roles.includes("admin"))
                throw new ForbiddenError("not authorized");
            return userDB;
        },
        user: (_, { id }) => { // 에러 핸들링 2.
            if (id < 0)
                /// Error 생성자로 넘기는 문자열이 오류 메세지가 됨. 
                /// 그러나 오류코드는 항상 'Internal_server_error'로 고정됨.
                /// 다양하게 error에 대해서 알려면 'ApolloErorr'를 사용해야함.

                /// ApolloError 클래스는 인자로 message와 code, properties를 받는다. 
                /// code에는 오류 코드로 사용할 문자열을 넘기고, 
                /// properties에는 그 밖에 오류 관련 정보를 객체로 넘기면 됩니다.
              throw new ApolloError("id must be non-negative", "INVALID_ID", {
                parameter: "id"
              });
            return {
              id,
              email: `test${id}@email.com`
            };
        },
        readJobPortfolio : async () => {
            let conn;
            try {
                conn = await pool.getConnection();
                const rows = await conn.query('SELECT * FROM users');
                return rows;
            } catch (err) {
                throw err;
            } finally {
                if (conn) conn.end();
            }
        },
        readJobPortfolios : async () => {
            let conn;
            try {
                conn = await pool.getConnection();
                const rows = await conn.query('SELECT * FROM users');
                return rows;
            } catch (err) {
                throw err;
            } finally {
                if (conn) conn.end();
            }
        },
        // allUsers: () => {
        //     throw new Error("allUsers query failed");
        //   },
    }
};

const formatError = (err) => {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
    return err;
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
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
    console.log(`Listening at ${url}`);
});






// const expressGraphQL = require('express-graphql');
// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLList,
//   GraphQLInt,
//   GraphQLNonNull
// } = require('graphql');
// const authors = [
// 	{ id: 1, name: 'J. K. Rowling' },
// 	{ id: 2, name: 'J. R. R. Tolkien' },
// 	{ id: 3, name: 'Brent Weeks' }
// ]

// const books = [
// 	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
// 	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
// 	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
// 	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
// 	{ id: 5, name: 'The Two Towers', authorId: 2 },
// 	{ id: 6, name: 'The Return of the King', authorId: 2 },
// 	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
// 	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
// ]

// const BookType = new GraphQLObjectType({
//   name: 'Book',
//   description: 'This represents a book written by an author',
//   fields: () => ({
//     id: { type: GraphQLNonNull(GraphQLInt) },
//     name: { type: GraphQLNonNull(GraphQLString) },
//     authorId: { type: GraphQLNonNull(GraphQLInt) },
//     author: {
//       type: AuthorType,
//       resolve: (book) => {
//         return authors.find(author => author.id === book.authorId)
//       }
//     }
//   })
// })

// const AuthorType = new GraphQLObjectType({
//   name: 'Author',
//   description: 'This represents a author of a book',
//   fields: () => ({
//     id: { type: GraphQLNonNull(GraphQLInt) },
//     name: { type: GraphQLNonNull(GraphQLString) },
//     books: {
//       type: new GraphQLList(BookType),
//       resolve: (author) => {
//         return books.filter(book => book.authorId === author.id)
//       }
//     }
//   })
// })

// const RootQueryType = new GraphQLObjectType({
//   name: 'Query',
//   description: 'Root Query',
//   fields: () => ({
//     book: {
//       type: BookType,
//       description: 'A Single Book',
//       args: {
//         id: { type: GraphQLInt }
//       },
//       resolve: (parent, args) => books.find(book => book.id === args.id)
//     },
//     books: {
//       type: new GraphQLList(BookType),
//       description: 'List of All Books',
//       resolve: () => books
//     },
//     authors: {
//       type: new GraphQLList(AuthorType),
//       description: 'List of All Authors',
//       resolve: () => authors
//     },
//     author: {
//       type: AuthorType,
//       description: 'A Single Author',
//       args: {
//         id: { type: GraphQLInt }
//       },
//       resolve: (parent, args) => authors.find(author => author.id === args.id)
//     }
//   })
// })

// const RootMutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   description: 'Root Mutation',
//   fields: () => ({
//     addBook: {
//       type: BookType,
//       description: 'Add a book',
//       args: {
//         name: { type: GraphQLNonNull(GraphQLString) },
//         authorId: { type: GraphQLNonNull(GraphQLInt) }
//       },
//       resolve: (parent, args) => {
//         const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
//         books.push(book)
//         return book
//       }
//     },
//     addAuthor: {
//       type: AuthorType,
//       description: 'Add an author',
//       args: {
//         name: { type: GraphQLNonNull(GraphQLString) }
//       },
//       resolve: (parent, args) => {
//         const author = { id: authors.length + 1, name: args.name }
//         authors.push(author)
//         return author
//       }
//     }
//   })
// })

// const schema = new GraphQLSchema({
//   query: RootQueryType,
//   mutation: RootMutationType
// })

// app.use('/graphql', expressGraphQL({
//   schema: schema,
//   graphiql: true
// }))