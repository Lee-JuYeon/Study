const database = require('./database');
const { ApolloServer, gql } = require('apollo-server');

const queries = require('./typedefs-resolvers/_quries')
const mutations = require('./typedefs-resolvers/_mutation')
const equipments = require('./typedefs-resolvers/equipments')
const supplies = require('./typedefs-resolvers/supplies')
const enums = require('./typedefs-resolvers/_enums')

const typeDefs = [
    queries,
    mutations,
    enums,
    equipments.typeDefs,
    supplies.typeDefs
]

const resolvers = [
    equipments.resolvers,
    supplies.resolvers
]

const server =  new ApolloServer({typeDefs, resolvers})


server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});