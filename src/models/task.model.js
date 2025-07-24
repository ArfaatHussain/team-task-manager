import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

export {Task}
