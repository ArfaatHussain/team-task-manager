import { connectDatabase, sequelize } from "./config/database.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: './env' });

import { User } from "./models/user.model.js";
import { Team } from "./models/team.model.js";
import { Task } from "./models/task.model.js";
import './models/associations.js';

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    await sequelize.sync();
    console.log('Database synced successfully!');

    app.listen(port, () => {
      console.log("Server is running on Port", port);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // Exit with failure code
  }
}

startServer();
