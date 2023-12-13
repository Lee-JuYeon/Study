require("dotenv").config();

const { postgraphile } = require('postgraphile');
const { DB_NAME, DB_USER, DB_PW, DB_HOST, DB_PORT } = process.env

module.exports = postgraphile(
    {
        database: DB_NAME,
        user: DB_USER,
        password: DB_PW,
        host: DB_HOST,
        port: DB_PORT,
    },
    'public',
    {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
    }
)
