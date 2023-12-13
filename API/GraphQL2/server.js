require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postgraphile = require('./db/postgraphile');
const { ApolloServer, gql, ApolloError, AuthenticationError } = require('apollo-server');


const { PORT } = process.env

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
        // user: (_, { id }) => {
        //     if (id < 0)
        //       throw new ApolloError("id must be non-negative", "INVALID_ID", {
        //         parameter: "id"
        //       });
        //     return {
        //       id,
        //       email: `test${id}@email.com`
        //     };
        // }
        ping: () => "pong",
        authenticate: (parent, { username, password }) => {
            const found = users.find(
                user => user.username === username && user.password === password
            );
            console.log(found);
            return found && found.token;
        },
        me: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            return user;
        },
        users: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            if (!user.roles.includes("admin"))
                throw new ForbiddenError("not authorized");
            return users;
        }
    }
}




app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(postgraphile)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))









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