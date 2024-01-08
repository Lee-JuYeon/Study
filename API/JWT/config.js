require("dotenv").config();


            /*
            iss : 토큰 발급자 (issuer)
            sub : 토큰 제목 (subject)
            aud : 토큰 대상자 (audience)
            exp : 토큰의 만료시간 (expiration) / 형식은 NumericDate
            nbf : Not Before 을 의미 / 토큰의 활성 날짜
            */
           
module.exports = {
    aesKey : process.env.AES256_KEY,
    accessKey : process.env.ACCESS_SECRET, // 원하는 시크릿 ㅍ키
    refreshKey : process.env.REFRESH_SECRET, 
    options : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "1m",  // 토큰 유효 기간
        issuer : "발행자" // 발행자
    }
}