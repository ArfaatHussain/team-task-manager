import { sequelize } from '../config/database.js';
import { DataTypes, where } from 'sequelize';


const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Team.beforeDestroy(async (team, options) => {
  await User.update(
    { teamId: null },
    { where: { teamId: team.id }, transaction: options.transaction }
  );
  await Task.update(
    { teamId: null },
    { where: { teamId: team.id }, transaction: options.transaction }
  )
});


export { Team }
