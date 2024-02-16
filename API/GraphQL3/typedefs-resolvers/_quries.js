const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        people: [People]
        peopleFiltered(
            team: Int,
            sex: Sex,
            blood_type: BloodType
            from: String
        ): [People]
        equipments: [Equipment]
        equipmentAdvs: [EquipmentAdv]
        softwares: [Software]
        software : Software
        supplies: [Supply]
        unionExamples : [UnionExample]
    }
`

module.exports = typeDefs
