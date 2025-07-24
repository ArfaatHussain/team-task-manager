import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';


const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export {Team}
