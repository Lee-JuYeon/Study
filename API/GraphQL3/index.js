const {
    ApolloServer,
    gql,
    PubSub
} = require("apollo-server"); // graphql server instance 생성.
const faker = require("faker");
/// graphQL에는 query, mutation, subscription. 총 3가지의 operation type 있다.
/// query는 데이터 조회
```
GraphQL에는 query, mutation, subscription. 총 3가지의 opration이 있다.
query : 데이터 조회 && sever/client 모델 방식.
mutation : 데이터 변경 && publish/subscription 방식(발행,구독)
subscription : real-time의 데이터 조회

subscription, 왜쓰는건데? 
server+client모델은 클라이언에서 최신의 데이터를 받아오려면 서버를 자주 호출해야함.
접속자가 많은 서버에서 동시 다발적으로 변경이 발생하는 경우 클라이언트에서 서버를 자주 호출하더라도 '실시간'을 구현하기 힘듦.
또한, 업데이트가 자주 발생하지 않는데도 '실시간'을 구현하려고 쉴세없이 서버를 호출하는건 엄청난 코스트 낭비다.
이에 GraphQL은 WebSocket프로토콜을 이용하여 서버와 클라이언트를 채널 연결을 유지한채로 서버에서 발생하는 이벤트를 '실시간'으로 수신받는다.
우리는 이걸 'subscription'이다.

graphQL에서는 Apollo server가 자체적으로 pub/sub엔진을 내장하고 있다.
```
const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    ping: String
  }
  type Subscription {
    messageAdded: String
  }
`;

const resolvers = {
  Query: {
    ping: () => "pong",
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

```
1초마다 setInterval 함수를 통하여 
pubusb객체에 puslbish하여 'messageAdded'라는 라벨으로 이벤트 발생시킨다.
messageAdded라벨 뒤에 값은 json으로 보인다.
```
setInterval(() => {
    pubsub.publish("messageAdded", {
      messageAdded: faker.lorem.sentence(),
    });
}, 1000); 


const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
server.listen().then(({ url }) => {
    console.log(`Listening at ${url}`);
});