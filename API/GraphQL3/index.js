const database = require('./database');
const { ApolloServer, gql } = require('apollo-server');

const _queries = require('./typedefs-resolvers/_quries')
const _mutations = require('./typedefs-resolvers/_mutation')
const _unions = require('./typedefs-resolvers/_unions')
const _enums = require('./typedefs-resolvers/_enums')
const equipments = require('./typedefs-resolvers/equipments')
const supplies = require('./typedefs-resolvers/supplies')
const softwares = require('./typedefs-resolvers/softwares')

const typeDefs = [
    _queries,
    _mutations,
    _enums,
    equipments.typeDefs,
    softwares.typeDefs,
    supplies.typeDefs,
    _unions.typeDefs,
]

const resolvers = [
    equipments.resolvers,
    softwares.resolvers,
    supplies.resolvers,
    _unions.resolvers
]

const server =  new ApolloServer({typeDefs, resolvers})


server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});