import { User } from "./user.model.js";
import { Team } from "./team.model.js";
import { Task } from "./task.model.js";
import { Membership } from "./membership.model.js";

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

Team.hasMany(Task);
Task.belongsTo(Team);

Task.belongsToMany(User, { through: Membership, foreignKey: 'taskId' });

export { User, Team, Task, Membership };
