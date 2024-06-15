import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize("the_24_game", "root", "root_password", {
  host: "localhost",
  port: 3307,
  dialect: "mysql"
});

export { sequelize };
