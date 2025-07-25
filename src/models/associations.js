import { User } from "./user.model.js";
import { Team } from "./team.model.js";
import { Task } from "./task.model.js";


Team.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Team, { foreignKey: 'createdBy', as: 'createdTeams' });

User.belongsTo(Team, { foreignKey: 'teamId', as: 'memberOf' });
Team.hasMany(User, { foreignKey: 'teamId', as: 'members' });


Task.belongsTo(Team, { foreignKey: 'teamId', as: 'assignedTeam' });
Team.hasMany(Task, { foreignKey: 'teamId' });


Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });


export { User, Team, Task };
