const mariadb = require('mariadb');

require("dotenv").config();

// Mariadb 연결 정보
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT // 연결 수 제한 (선택 사항)
});

module.exports = {
    pool : pool
}