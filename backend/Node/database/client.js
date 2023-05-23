const pool = require('./connecter.js')

const mysqlClient = 
{
    executeQuery: async function(query, values)
    {
        results = await pool.executeQuery(query, values)

        return results
    }
}

module.exports = mysqlClient