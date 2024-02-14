const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')

/*
union. 유니언 타입이란?
값을 A또는 B로 변환하여 받을 수 있다. 
그래서 배열 내에 여러 타입의 데이터를 담을 수 있다.
*/

const typeDefs = gql`
    union UnionExample = Equipment | Supply
`
const resolvers = {
    Query: {
        /*
        쿼리 날릴 때 
        query {
            unionExamples {
                ... on Equipment {
                    id
                    used_by
                }
                ... on Supply {
                    id
                    teams
                }
            }
        }
        이런식으로 구성이 되는데, " ... on DataType "은 '만약 데이터 타입이 DataType'에 해당된다면 이라는 뜻이다.
        위의 쿼리를 해석하자면, 
        unionExamples라는 배열에 속해있는 해당 데이터타입이 
        Equipment라면 id, used_by만 가지고 반환하고,
        Supply라면 id, teams만 가지고 반환해라 이런뜻이다.
        */
        unionExamples: (parent, args) => {
            return [
                ...dbWorks.getEquipments(args),
                ...dbWorks.getSupplies(args)
            ]
        }
    },
    UnionExample: {
        /*
         데이터에 used_by가 있으면 equiment로 변환하고, 
         반대로 team이 있으면 Supplt로 데이터 타입을 변환한다.
         */
        __resolveType(given, context, info) {
            if (given.used_by) {
                return 'Equipment'
            }
            if (given.team) {
                return 'Supply'
            }
            return null
        }
    }
}


module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}