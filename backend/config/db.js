const { Sequelize } = require('sequelize');
const mysql = require("mysql2/promise");


let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root_password",
    database: "the_24_game",
  });
};

const sequelize = new Sequelize("the_24_game", "root", "root_password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = { sequelize, initMySQL, conn };
