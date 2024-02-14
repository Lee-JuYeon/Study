const { gql } = require('apollo-server')

/*
interfaces는 공통된 DTO의 필드를 한번에 묵어주는 역할을 한다.

*/
const typeDefs = gql`
    interface InterfaceExample {
        id: ID!
        used_by: Role!
    }
`
const resolvers = {
    InterfaceExample: {
        __resolveType(model, context, info) {
            if (model.developed_by) {
                return 'Software'
            }
            if (model.new_or_used) {
                return 'Equipment'
            }
            return null
        }
    }
}
module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}