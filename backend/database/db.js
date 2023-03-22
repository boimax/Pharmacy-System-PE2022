const Pool = require('pg').Pool;
const {db:config} = require("../config");
const pool = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASSWORD,
    port: config.PORT,
    ssl: config.enableSSL ?{
        rejectUnauthorized: false,
        ca: config.caFile
    } : undefined,
});

module.exports = pool;