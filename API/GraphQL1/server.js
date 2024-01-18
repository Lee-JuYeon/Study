const { 
    ApolloServer,
    gql, 
    ApolloError, 
    AuthenticationError,
    ApolloClient,
    InMemoryCache 
} = require('apollo-server');
const depthLimit = require('graphql-depth-limit');
const customAuthentication = require("./auth/auth");

const userDB = require("./db/users");
const mariaDB = require("./db/mariadb");
const postgraphileDB = require("./db/postgraphile");

const customResolver = require("./resolvers/customResolver");
const customTypeDefs = require("./typeDefs/customTypeDefs");

require("dotenv").config();

const client = new ApolloClient({
    link: createHttpLink({ uri: "https://countries.trevorblades.com" }),
    cache: new InMemoryCache()
});

const formatError = err => {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
    return err;
};

const server = new ApolloServer({ 
    customTypeDefs,
    customResolver,
    context: ({ req }) => { 
        // context에서 모든 요청 정보를 인자(req)로 받으며, 
        // 모든 resolver 함수에서 공유할 수 있는 데이터를 제공하는 역
        if (!req.headers.authorization.refreshToken) throw new AuthenticationError("missing refreshToken");

        const accessToken = req.headers.authorization.split(" ")[1];
        if (!accessToken) {
            return null;
          }

        const user = users.find((user) => user.token === token); // 인증 토큰에 매칭되는 사용자가 있는지 users 배열을 검색
        // if(!user) throw new AuthenticationError("invalid token"); // 사용자가 없다면 인증 실패 상황이므로 AuthenticationError 에러를 던짐
        
        const user = AuthService.getUser(req);

        return { 
            user: user, 
            db: { 
                users, 
                notes 
            } 
        };
    },
    formatError,
    debug: false
});

server.listen().then(({ url }) => {
   console.log(`Running on ${url}`); 
});

// CREATE TABLE JobPortfolio (
//     id VARCHAR(36) PRIMARY KEY,
//     userID VARCHAR(255),
//     hasJob BOOLEAN,
//     workMonth INT,
//     jobSkill TEXT, 
//     portfoiloURL TEXT,
//     certification TEXT, 
//     languages TEXT, 
//     education VARCHAR(255)
// );

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
