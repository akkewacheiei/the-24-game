import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from "../config/db";

interface HistoryAttributes {
  id: number;
  numbers: string;
  solution: string;
  isCorrect: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HistoryCreationAttributes extends Optional<HistoryAttributes, 'id'> {}

class History extends Model<HistoryAttributes, HistoryCreationAttributes> implements HistoryAttributes {
  public id!: number;
  public numbers!: string;
  public solution!: string;
  public isCorrect!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

History.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  numbers: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  solution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'histories',
  timestamps: true,
});

export default History;
