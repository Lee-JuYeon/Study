const { ApolloServer, gql, ApolloError } = require('apollo-server');
const mariadb = require('mariadb');
const depthLimit = require('graphql-depth-limit');
require("dotenv").config();


const appOptions : Options = {

}
// Mariadb 연결 정보
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT // 연결 수 제한 (선택 사항)
});

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
        errors : [String]
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
    }
}


const formatError = err => {
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
    formatError,
    debug: false
});

server.listen().then(({ url }) => {
   console.log(`Running on ${url}`); 
});

CREATE TABLE JobPortfolio (
    id VARCHAR(36) PRIMARY KEY,
    userID VARCHAR(255),
    hasJob BOOLEAN,
    workMonth INT,
    jobSkill TEXT, 
    portfoiloURL TEXT,
    certification TEXT, 
    languages TEXT, 
    education VARCHAR(255)
);

/*

const resolvers = {
    Query: {
        // moneyList(root, args){
        //     console.log(`age : ${args}`);
        //     return null;
        // },
        // placeList(){
        //     return resolver_placeList;
        // },
        place(root, { title }){
            console.log(`args : ${title}`);
            return resolver_placeList.find((place) => place.title == "title 2");
        }
    },
    Mutation : {
        postPlace(_, { title }) {
            const newPlace = {
                id : "11",
                title
            };
            resolver_placeList.push(newPlace);
            return newPlace;
        },
        deletePlace(_, { title, id}){
            const place = resolver_placeList.find((place) => place.id === id);
            if (!place) return false;
            resolver_placeList = resolver_placeList.filter((place) => place.id !== place);
            return true
        }
    }
};

const typeDefs = gql `
    type Money {
        id: ID
        country: String
        category: String
        createdDate: String
        title: String
    }
    type Job {
        id: ID
        country: String
        category: String
        createdDate: String
        title: String
    }
    type Place {
        id: ID
        country: String
        category: String
        createdDate: String
        title: String
    }
    type Insurance {
        id: ID
        country: String
        category: String
        createdDate: String
        title: String
    }
    type Query {
        place(title : String) : Place
        getJobList(country: String!, category: String!): [Job]
        getPlaceList(country: String!, category: String!): [Place]
        getInsuranceList(country: String!, category: String!): [Insurance]
        getMoneyList(country: String!, category: String!): [Money]
    }
    type Mutation {
        postMoney(title: String!): Money
        postJob(title: String!): Job
        postPlace(title: String!): Place
        postInsurance(title: String!): Insurance

        deleteMoney(title: String!, id: ID!): Boolean
        deleteJob(title: String!, id: ID!): Boolean
        deletePlace(title: String!, id: ID!): Boolean
        deleteInsurance(title: String!, id: ID!): Boolean

        updateMoney(title: String!, id: ID!, country: String!, category: String!) : Money
        updateJob(title: String!, id: ID!, country: String!, category: String!) : Job
        updatePlace(title: String!, id: ID!, country: String!, category: String!) : Place
        updateInsurance(title: String!, id: ID!, country: String!, category: String!) : Insurance

    }

`;

*/
