import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';

const Membership = sequelize.define('Membership', {
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Member',
  },
}, {
  timestamps: true,
});

export {Membership}
