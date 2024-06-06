const { Pool } = require("pg");
const knexLib = require('knex');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "GRB_dB",
    password: "Luthfi21",
    port: 5432,
});

const knex = knexLib({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Luthfi21',
        database: 'GRB_dB'
    }
});

module.exports = { pool, knex };
