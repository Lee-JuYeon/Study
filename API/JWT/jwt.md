# 🪙 JWT
Json Web Token, 줄여서 JWT라고 한다.


### 🤔 JWT 토큰이 뭐임?
'세션 인증 방식'을 대체할 수 있는 수단이 '토큰 기반 인증'이고, 그 중에서도 가장 많이 사용되는 토큰이 JWT이 유명함.

* 세션 인증 방식
    * 서버 or DB에 사용자를 특정할 수 있는 세션 ID를 생성해서 저장
    * 클라이언트의 cookie에 세션정보를 저장. 
    * 리액트앱이라면 cookie 뿐만 아니라State, Local Storage에도 저장가능
    * 매 요청시 session을 cookie에 담아 헤더에 실어서 보내면 서버는 사용자를 인증.
    - 단점
        - 매 요청마다 DB에 접근해야함.
        - DB에서 session 정보를 계속 저장하는 것도 아니라 DB에 부담이 됨.
        - cookie정보들은 클라이언테 저장되어 JS로 접근이 가능하기 때문에 XSS공격에 취약함.
* 토큰 인증 방식
    * 사용자 정보를 암호화하여 토큰을 클라이언트에 저장해서 사용기때문에 안전하게 관리
    * 서버가 사용자 정보를 저장할 필요가 없으며 토큰이 정상적인 토큰인지만 확인하면 되어 불필요한 코스트를 낭비할 필요가 없다.
    * 여러 서버에서 검토가 가능하기 때문에, 서버마다 인증을 할 필요가 없다.
    * 토큰을 다른 기관에서 발급받을 수 있어서 토큰 생성만 하는 서버를 따로 생성하거나 다른 회사에 토큰 생성 작업을 맡길 수 있어서 토큰관리의 용이성이 높다.
    * JWT는 3부분으로 나뉜다
        * Header
            * JWT의 타입, 해시 알고리즘 지정.
            ```
            {
                "typ": "JWT (JWT의 타입)",
                "alg": "HS256 (해더의 해시알고리즘. 주로 HS256,RS256,EES256)"
            }
            ```
            
        * Payload
            * JWT의 실직적인 데이터를 담는다.
            * 사용자가 사용가능한 권한 카테고리를 담아 사용자별 권한을 관리하기 용이.
            ```
            {
                "sub": "토큰 소유자1",
                "name": "토큰 소유자1의 이름",
                "exp": 1643264000(토큰 만료시간),
                "iat": 1231123(토큰 발행시간),
                "aud": "토큰을 받을 대상",
                "iss": "토큰 발행한 발급자"
            }
            ```
        * Signature
            * Header와 Payload의 해시값을 사용하여 계산한 값
            * JWT의 유효성을 검사
            
            
### 🤔 종류도 있음?
* Access Token : 사용자 정보에 접근할 수 있는 권한을 부여하는데 사용
    * 클라이언트는 서버에 최초 요청을 보내면 해킹에 대비하기 위해 Aceess,RefreshToken 둘다 받게 되는데, 실제 권한은 AccessToken에 사용된다.
        - ❗️ 두개 받는거랑 권한이랑 뭔상관?
            1. 해커가 Access Token을 탈취하면 본인인척 서버에 권한을 부여받음. AccessToken은 유효기간이 원래 짧은 토큰이라 장기간 사용하지 못한다고 하는데, 솔직히 효과가 있는지 모르겠다.
* Refresh Token : 갱신에 사용.
    * AceessToken의 유효기간이 지나게 되면 Refresh Token을 사용해 새로운 AccessToken을 발급받는다.
    - ❗️ 단점
        - 해커는 지속적으로 Refresh Token을 사용해 AccessToken을 갱신하게 될 것이다.
        - RefreshToken을 사용하지 않는 웹사이트는 짧은 시간 AccessToken만으로 사용자 정보를 관리하여 정보 유출을 막는다.


### 🤝🏻 인증 절차는?
1. 사용자는 서버에 ID/Password 등 사용자 정보를 제공하고 로그인 요청.
2. 서버는 사용자 정보를 검증이후에 암호화된 토큰 생산.
3. 암호화된 토큰 생산시 토큰의 payload에는 사용자를 식별할 수있는 정보와 권한 등등이 저장됨. ( local storage, cookie, state등에 저장)
4. 이 후 요청부터는 사용자가 http헤더에 토큰을 담아 보낸다. 이때 토큰을 담는 속성은 authorization이다.
5. 서버는 헤더에 존재하는 토큰을 해독한 후, 정상일경우 사용자 요청을 처리애 응답.


### Client는 JWT 토큰을 어디에 저장할까
🍪 Cookie?
* 장점
    * 서버가 보낸 4KB까지 저장가능.
    * 서버에서 접근할 수 있음.
    * HTTP Request시 자동으로 포함.
    * HttpOnly 설정을 추가하여 JS접근을 막을 수 있음 ( script를 이용한 XSS공격 차단)
* 단점
    * CSRF공격에는 노출이 됨.

🗄️ Web Storage?
1. Session Storage
    * 서버접근 불가능
    * Session Cookies와 비슷 ( 세션을 위한 저장 공간)
    * 세션이 종료되면 모두 삭제 ( 브라우저 종료시 삭제됨 )
    * 5 ~ 10MB 크기를 갖는 공간
2. Local Storage
    * 서버접근 불가능
    * Persistent Cookies와 비슷
    * 반 영구적으로 저장가능
    * 5 ~ 10MB 크기를 갖는 공간

결론 : 
    Script삽입하는 XSS 공격 해킹의 측면에서 볼 때, WebStorage는 JS로 접근이 가능하기에 HttpOnly속성으로 JS를 차단할 수 있는 'Cookie'에 저장하는게 나을수도 있다.

### Bearer 토큰이란?
OAuth 2.0 및 기타 인증 메커니즘에서 사용되는 인증 방식 중 하나
HTTP 헤더에 사용자의 인증 정보를 포함시켜 요청을 보내는 인증 방법 중 하나


### HTTP Request시 Token은 어디에?
Coockie, Authorization은 모두 HTTP Request header 내부에 있는 필드다. 따라서 위치가 같기에 보안성이 같지만 선호도로 봤을 때 Authorization이 더 많다.

1. Cookie에 Token 넣기
```
(/routes/user.js) - 서버측에서 Cookie에 Token담아 보내기


/* x_auth라는 이름으로 유저의 토큰을 쿠키에 넣는 것 ! */
res.cookie("x_auth", user.token)
    .status(200)
    .json({ loginSuccess: true, userId: user._id })


(/middleware/auth.js) - 서버측에서 Client가 보낸 Request에서 토큰 파싱 하는 것 !

const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는곳 
    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    // 토큰을 복호화 한후  유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })
        req.token = token;
        req.user = user;
        next();
    })
}
module.exports = { auth };

```

2. Authorization에 Token 넣기
client가 HTTP Response Body에서 받은 Token을 아래처럼 많이 사용.

```
Bearer 토큰번호

if(
    req.headers.authorization &&
    req.headers.authorization.startWith('Bearer')
){
    // 앞에 Bearer과 하나의 공백을 빼고 토큰 값만 파싱 
    token = req.headers.authorization.split(' ')[1];
} else if (req.cookies.token){ 
    // 아래 부분은 혹시 쿠키에 토큰이 있는 경우를 대비해 처리 
    token = req.cookies.token;
}
```


여기서 드는 생각들
1. refresh토큰을 사용하여 access토큰을 재발행하는 것과, 아예 새로 access토큰을 동시에 생성하는 경우 유효기간이 같은데 왜 굳이 새로 생성하는 것이 아닌 토큰을 refresh를 이용하여 재발행하는거임?
 - access token을 새로 생성하는 경우, 기존 access token의 데이터를 다시 전송해야기 때문에, refresh token을 이용하면 기존 access token의 데이터를 그대로 사용할 수 있기에 access 토큰의 유효기간이 짧게 설정되어 있는 경우 refresh token을 사용하는것이 더 효율적이다.

2. 근데 refresh token의 악용이나 보안측에서 재발행보다는 아예 access token을 새로 만드는게 안전하지 않냐?
 - 맞음, refresh 토큰을 탈취해 access토큰을 재발행하든가의 악용이 가능함. 그래서 access토큰의 유효기간이 길게 설정되어 있는 경우, 1번 항목처럼 refresh token을 이용하여 토큰을 재발행하는 것보단 아예 access 토큰을 새로 만드는 것이 나음.

3. refresh token에서 유저 정보를 가져와서 다시 그걸로 access 토큰에 유저정보를 넣는 코스트와, 새로 access 토큰에 같은 유저 정보를 새로 넣는 코스트는 결국엔 같지 않냐?
 - 그럴 수 있음. 근데 유저 정보가 변할 경우에 대비해 refresh token을 사용하면 '정보 유지'가 가능함. 근데, refresh token을 저장하는 경우 안전하게 해야함.
        - refresh token을 암호화하여 저장함.
        - refresh token을 client에게 직접 발급하지않고, 중간 서버를 통해 발급.
        - refresh token의 유효기간을 짧게 설정함.
4. 딱히 refresh token을 운영하는 것에 대해서 '정보 유지'가 가능하다는 것 말고는 장점이 없는듯?
 - Access 토큰의 유효기간이 짧은 경우, Refresh 토큰을 사용하여 Access 토큰을 재발행하는 것이 더 효율적. 이는 기존 Access 토큰의 데이터를 유지할 수 있기 때문
    * refresh token 적합경우 
        * access token의 유효기간이 짧은 경우
        * 사용자의 편의성을 중요하게 고려하는 경우
    * refresh token 비적합 경우
        * 보안을 중요하게 고려시
        * access token의 유효기간이 긴 경우

5. refresh token이 그럼 계속 문제가 되는데, refresh token을 쿠키가 아닌 아예 구글같은 대형 클라우드 서비스에다가 저장하면 보안에 대해서 한시름 놓지 않을까? 
 - 괜찮은 생각임. JWT는 "헤더.페이로드.서명"을 문자열 형태로 파이어베이스에 저장하는게 좋을듯.

6. 근데 cookie에 저장하는게 일반적인 룰인데, 파베에 저장해도 되는거임? 무슨 문제같은거 생기지 않을까?
 - 가장먼저 효율성이 떨어지고 코드가 길어질 예정이고, firebase가 일정 선을 넘으면 유료이기 때문에 추가적인 코스트가 발생한다.
 - 그러면 access token의 유효기간을 짧게 설정하여 access토큰이 만료될때까지 탈취될 위험을 줄일 수 있다.


```
- Refresh 토큰을 Firebase Realtime Database에 저장하는 방법

var firebase = require('firebase');

- Firebase Realtime Database에 연결합니다.
firebase.initializeApp({
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
databaseURL: "YOUR_DATABASE_URL"
});

- Refresh 토큰을 생성합니다.
var refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

- Refresh 토큰을 Firebase Realtime Database에 저장합니다.
firebase.database().ref("users/[USER_ID]/refreshToken").set(refreshToken);

- Firebase Cloud Firestore에 Refresh 토큰을 저장하는 방법
var firebase = require('firebase');

- Firebase Cloud Firestore에 연결합니다.
firebase.initializeApp({
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
databaseURL: "YOUR_DATABASE_URL"
});

- Refresh 토큰을 생성합니다.
var refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

- Refresh 토큰을 Firebase Cloud Firestore에 저장합니다.
firebase.firestore().collection("users").doc("[USER_ID]").set({
refreshToken: refreshToken
});

이렇게 하면, Refresh 토큰이 Firebase Realtime Database 또는 Firebase Cloud Firestore에 저장됩니다.
```