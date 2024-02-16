const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')
const typeDefs = gql`
    type People {
        id: ID!
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String!
        interfaceExample: [InterfaceExample]
        unionExample: [UnionExample]
    }
    
    input PostPersonInput {
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String!
    }
`
const resolvers = {
    Query: {
        people: (parent, args) => dbWorks.getPeople(args),
        peopleFiltered: (parent, args) => dbWorks.getPeople(args),
        peoplePageinated: (parent, args) => dbWorks.getPeople(args)
    }
}
module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}