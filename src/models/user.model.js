import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  timestamps: true
});

User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

User.prototype.generateRefreshToken = function () {
  return jwt.sign({
    id: this.id,
    username: this.username,
    email: this.email
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


User.prototype.generateAccessToken = function () {
  return jwt.sign({
    id: this.id
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

import { Task } from './task.model.js';

User.beforeUpdate(async (user, options) => {
  if (user.changed('teamId') && user.teamId === null) {
    await Task.update(
      { assignedTo: null },
      {
        where: { assignedTo: user.id },
        transaction: options.transaction 
      }
    );
  }
});


export { User }
