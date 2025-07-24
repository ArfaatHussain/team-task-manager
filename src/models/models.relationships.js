import { User } from "./user.model.js";
import { Team } from "./team.model.js";
import { Task } from "./task.model.js";
import { Membership } from "./membership.model.js";

// User and Team (Many-to-Many relationship via Membership)
User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

// Team and Task (One-to-Many relationship)
Team.hasMany(Task);
Task.belongsTo(Team); // Task belongs to Team, with team_id as the foreign key

// Task and User (One-to-Many, Task belongs to a User)
Task.belongsTo(User, { as: 'AssignedUser', foreignKey: 'assignedTo' }); // Task is assigned to a user

export { User, Team, Task, Membership };
