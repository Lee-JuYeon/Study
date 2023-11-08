import { ApolloServer, gql } from "apollo-server"; 

const resolver_placeList = [
    {
        id: "id 1",
        country: "country 1",
        category: "category 1",
        createdDate: "createdDAte 1",
        title: "title 1"
    },
    {
        id: "id 2",
        country: "country 2",
        category: "category 2",
        createdDate: "createdDAte 2",
        title: "title 2"
    }
];

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
        postMoney() {
            return [Money]
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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
   console.log(`Running on ${url}`); 
});