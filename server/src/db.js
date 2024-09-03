const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "smart_check_list",
  password: "root",
  port: 5432,
});

module.exports = pool;
