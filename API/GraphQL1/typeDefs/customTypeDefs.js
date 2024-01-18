const { gql } = require('apollo-server');

const customTypeDefs = gql`
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

module.exports = {
    customTypeDefs : customTypeDefs
}