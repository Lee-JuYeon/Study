GraphQL이 REST API로부터 해결한 것.
1. under-fetching
    - 자격증 api를 예로 들어보면, 자격증 api에서는 자격증 이름이 아닌 코드넘버로 작성되어 있어서, 자격증 목록 api를 또 따로 request해야한다.
 이러한 문제점이 under-fetching이다.
2. over-fetching
    - 필요한 정보 이외에도 추가적으로 딸려오는 불필요한 데이터들이 많은 경우. 


npm install list
npm i nodemon -D
npm i apollo-server graphql


작업하면서 발생한 에러들
1. Apollo Server requires either an existing schema, moduels or typeDefs 
    (Apollo server는 존재하는 schema나 moduels 또는 typeDefs를 가져야한다.)
    - GraphQL이 data의 shape을 미리 알고있어야 하기 때문이다.
        - REST API에서는 수많은 url들의 집합인데, GraphQL은 수많은 type의 집합이다.
        GraphQL server한테 서버에 있는 data의 type을 설명해주어야한다.
