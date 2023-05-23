const { promisify } = require('util');
const mysql = require('mysql')

const pool = mysql.createPool
({
    host: 'databasemovierecommend.cahsvsumujui.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'password',
    database: 'movie_recommend',
    connectionLimit : 10,
})

module.exports = 
{
    pool: pool,
    getConnection: promisify(pool.getConnection).bind(pool),
    executeQuery: promisify(pool.query).bind(pool),
    releaseConnection: function(connection)
    {
      connection.release();
    },
    end: promisify(pool.end).bind(pool)
}