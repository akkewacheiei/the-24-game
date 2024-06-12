import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

interface UserAttributes {
  username: string;
  password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public username!: string;
  public password!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export { User };
