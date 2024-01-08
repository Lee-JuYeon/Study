// import AesCipher from "aes-js";
const AES = require('aes-js');
const { accessKey, refreshKey, options, aesKey } = require('./config');
const db = require('./DB');
const jwt = require('jsonwebtoken');



function encryptToken(token) {
    const cipher = new AES.AesCipher(aesKey, "AES-256-CTR");
    const encrypted = cipher.encrypt(token);
    return encrypted.toString("base64");
};

  
// jwt토큰생성. access, refresh 토큰생성해서 쿠키에 저장.
const initToken = (req, res, next) => {
    const { email, password, username } = req.body;
    const userInfo = db.filter((item) => { // 중복체크
        return item.email === email;
    })[0];

    console.log('req.body:', req.body); // 디버깅용 로그
    console.log('req.headers', req.headers); // 디버깅용 로그
    console.log(`eamil : ${email}, password : ${password}, username : ${username}`);


    if (!userInfo) { // 이메일 중복없다면 else로 넘어감.
        res.status(403).json({
            error : "Not Authorized",
            message : "중복된 이메일"
        });
    } else { 
        try { 
            // access Token 발급 
            const payload =  {
                id : userInfo.id,
                username : userInfo.username,
                email : userInfo.email,
            };





            const accessToken = jwt.sign(
                    payload, 
                    accessKey, 
                    options
                );

            // refresh Token 발급
            const refreshToken = jwt.sign(
                    payload, 
                    refreshKey, 
                    options
                );

            // token 전송, accessToken이란 이름으로 유저의 토큰을 헤더에 넣음.
            res.header('Authorization', `Bearer ${accessToken}`);

            // token 전송, accessToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
            res.cookie("accessToken", accessToken, {
                secure : false,
                httpOnly : true,
            })

            // token 전송, refreshToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
            res.cookie("refreshToken", refreshToken, {
                secure : false,
                httpOnly : true,
            })

            res.status(200).json({
                message : "create accessToken, refreshToken success, Save in cookie",
                accessToken : accessToken,
                refreshToken : refreshToken
            });
        } catch (error) {
            res.status(500).json({
                error : error,
                message : ""
            });
        }
    }
}

// AceessToken의 유효기간이 지나게 되면 ,
// AccessToken을 기반으로 만들어진 Refresh Token을 사용해 
// 새로운 AccessToken을 발급
const refreshToken = (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const data = jwt.verify(token, refreshKey)
        const userData = db.filter(item=>{
            return item.email === data.email;
        })[0]
  
        // access Token 새로 발급
        const accessToken = jwt.sign(
            {
                id : userData.id,
                username : userData.username,
                email : userData.email,
            }, 
            accessKey, 
            options
        );
    
        res.cookie("accessToken", accessToken, {
            secure : false, //https에서만 사용가능? false.
            httpOnly : true,
        })
        
        res.status(200).json({
            message : "create refreshToken success, Save in cookie",
            refreshToken : refreshToken
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const login = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const data = jwt.verify(token, accessKey);
    
        const userData = db.filter(item=>{
          return item.email === data.email;
        })[0];
    
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
};

const logout = (req, res) => {
    try {
        res.cookie('accessToken', '');
        res.status(200).json("Logout Success");
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    initToken,
    refreshToken,
    login,
    logout
}


// ```


// initTokenMiddleware.post('/accesstoken', (req, res) => {
//     try {
//         // email, password, username 값을 받아옴
//         const { email, password, username } = req.body;
    
//         // DB에서 사용자 정보를 조회
//         const userInfo = db.filter((item) => {
//             return item.email === email;
//         })[0];
    
//         // 사용자 정보가 없으면 에러를 반환
//         if (!userInfo) {
//             throw new Error('Not Authorized');
//             // res.status(500).json(error);
//         }
    
//         // access token을 생성
//         const payload = {
//             id: userInfo.id,
//             username: userInfo.username,
//             email: userInfo.email,
//         };

//         /*
//             iss : 토큰 발급자 (issuer)
//             sub : 토큰 제목 (subject)
//             aud : 토큰 대상자 (audience)
//             exp : 토큰의 만료시간 (expiration) / 형식은 NumericDate
//             nbf : Not Before 을 의미 / 토큰의 활성 날짜
//         */
//         const accessToken = encryptToken(
//             jwt.sign(
//                 payload, 
//                 accessKey, 
//                 {
//                     expiresIn: '1m',
//                     issuer: '발행자',
//                 }
//             ),
//         );

//         // refresh Token 발급
//         const refreshToken = encryptToken(
//             jwt.sign(
//                 payload, 
//                 refreshKey, 
//                 {
//                     expiresIn : '1m', // 유효기간 1분
//                     issuer : '발행자', // 발행자 이름
//                 }
//             )
//         );
    
//         // token 전송, accessToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
//         res.cookie('accessToken', accessToken, {
//             secure: false,
//             httpOnly: true,
//         });
    
//         // token 전송, refreshToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
//         res.cookie("refreshToken", refreshToken, {
//             secure : false,
//             httpOnly : true,
//         })

//         // 성공 응답을 반환
//         res.status(200).json(
//             {
//                 message: 'access, refresh token 발급 성공, cookie에 저장 성공',
//             }
//         );
//     } catch (error) {
//       res.status(500).json(error);
//     }
// });


// // jwt토큰생성. access, refresh 토큰생성해서 쿠키에 저장.
// const initToken = (req, res, next) => {
//     const { email, password, username } = req.body;
//     const userInfo = db.filter((item) => {
//         return item.email === email;
//     })[0];

//     if (!userInfo) {
//         res.status(403).json("Not Authorized");
//     } else { 
//         try { 
//             // access Token 발급 
//             const payload =  {
//                 id : userInfo.id,
//                 username : userInfo.username,
//                 email : userInfo.email,
//             };

//             /*
//             iss : 토큰 발급자 (issuer)
//             sub : 토큰 제목 (subject)
//             aud : 토큰 대상자 (audience)
//             exp : 토큰의 만료시간 (expiration) / 형식은 NumericDate
//             nbf : Not Before 을 의미 / 토큰의 활성 날짜
//             */
//             const accessToken = encryptToken(
//                 jwt.sign(
//                     payload, 
//                     accessKey, 
//                     {
//                         expiresIn : '1m', // 유효기간 1분
//                         issuer : '발행자', // 발행자 이름
//                     }
//                 )
//             );

//             // refresh Token 발급
//             const refreshToken = encryptToken(
//                 jwt.sign(
//                     payload, 
//                     refreshKey, 
//                     {
//                         expiresIn : '1m', // 유효기간 1분
//                         issuer : '발행자', // 발행자 이름
//                     }
//                 )
//             );

//             // token 전송, accessToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
//             res.cookie("accessToken", accessToken, {
//                 secure : false,
//                 httpOnly : true,
//             })

//             // token 전송, refreshToken이란 이름으로 유저의 토큰을 쿠키에 넣음.
//             res.cookie("refreshToken", refreshToken, {
//                 secure : false,
//                 httpOnly : true,
//             })

//             res.status(200).json("create accessToken, refreshToken success, Save in cookie");
//         } catch (error) {
//             res.status(500).json(error);
//         }
//   }
// }

// ```