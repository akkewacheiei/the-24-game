import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize("the_24_game", "root", "root_password", {
  host: "localhost",
  dialect: "mysql"
});

export { sequelize };
