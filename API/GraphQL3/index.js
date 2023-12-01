const {
    ApolloServer,
    gql,
    PubSub
} = require("apollo-server"); // graphql server instance 생성.
// const faker = require("faker");

// graphQL에는 query, mutation, subscription. 총 3가지의 operation type 있다.
// GraphQL에는 query, mutation, subscription. 총 3가지의 opration이 있다.
// query : 데이터 조회 && sever/client 모델 방식.
// mutation : 데이터 변경 && publish/subscription 방식(발행,구독)
// subscription : real-time의 데이터 조회
// subscription, 왜쓰는건데? 
// server+client모델은 클라이언에서 최신의 데이터를 받아오려면 서버를 자주 호출해야함.
// 접속자가 많은 서버에서 동시 다발적으로 변경이 발생하는 경우 클라이언트에서 서버를 자주 호출하더라도 '실시간'을 구현하기 힘듦.
// 또한, 업데이트가 자주 발생하지 않는데도 '실시간'을 구현하려고 쉴세없이 서버를 호출하는건 엄청난 코스트 낭비다.
// 이에 GraphQL은 WebSocket프로토콜을 이용하여 서버와 클라이언트를 채널 연결을 유지한채로 서버에서 발생하는 이벤트를 '실시간'으로 수신받는다.
// 우리는 이걸 'subscription'이다.
// graphQL에서는 Apollo server가 자체적으로 pub/sub엔진을 내장하고 있다.

const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    ping: String
    allUsers: [User]
    user(id: Int): User
  }

  type User {
    id: Int
    email: String
  }

  type Subscription {
    messageAdded: String
  }
`;

const resolvers = {
  Query: {
    ping: () => "pong",
    allUsers: () => { // 에러 핸들링 1
        throw new Error("allUsers query failed");
    },
    user: (_, { id }) => { // 에러 핸들링 2.
        if (id < 0)
            /// Error 생성자로 넘기는 문자열이 오류 메세지가 됨. 
            /// 그러나 오류코드는 항상 'Internal_server_error'로 고정됨.
            /// 다양하게 error에 대해서 알려면 'ApolloErorr'를 사용해야함.

            /// ApolloError 클래스는 인자로 message와 code, properties를 받는다. 
            /// code에는 오류 코드로 사용할 문자열을 넘기고, 
            /// properties에는 그 밖에 오류 관련 정보를 객체로 넘기면 됩니다.
            throw new ApolloError("id must be non-negative", "INVALID_ID", {
                parameter: "id",
            });
        return {
            id,
            email: `test${id}@email.com`,
        };
    },
  },
  Subscription: {
    messageAdded: {
        /// subscription은 subscribe 속성을 갖는 객체를 필요로 한다.
        /// asyncIterator메서드에 'messageAdded'을 넘겨주면, 
        /// subscription은 messageAdded 이벤트 발생마다 반응.
      subscribe: () => pubsub.asyncIterator("messageAdded"),
    },
  },
};

// ```
// 1초마다 setInterval 함수를 통하여 
// pubusb객체에 puslbish하여 'messageAdded'라는 라벨으로 이벤트 발생시킨다.
// messageAdded라벨 뒤에 값은 json으로 보인다.
// ```
// setInterval(() => {
//     pubsub.publish("messageAdded", {
//       messageAdded: faker.lorem.sentence(),
//     });
// }, 1000); 

const formatError = (err) => {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
    /// 반드시 인자로 받은 에러 객체를 다시 리턴을 해줘야 
    /// 라이언트까지 에러 정보가 전달
    return err; 
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError,
    debug: false, /// 서버에서 에러가 발생했을때 클라이언테에게 stacktrace까지 제공하는것은 보안상 권장되지 않음.
});
  
server.listen().then(({ url }) => {
    console.log(`Listening at ${url}`);
});