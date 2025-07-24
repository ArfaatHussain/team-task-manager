import { connectDatabase, sequelize } from "./config/database.js";
import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})


import { User } from "./models/user.model.js";
import { Team } from "./models/team.model.js";
import { Task } from "./models/task.model.js";

import './models/associations.js'
async function startDB() {
    await connectDatabase()
    await sequelize.sync();
    console.log('Database synced successfully!');
}

startDB()

const port = process.env.PORT

app.listen(port, () => {
    console.log("Server is running on Port ", port);
})
