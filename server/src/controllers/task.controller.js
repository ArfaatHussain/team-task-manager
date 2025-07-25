import { Task } from "../models/task.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create = asyncHandler(async (req, res) => {

    const { title, description, dueDate, teamId, assignedTo, creatorId } = req.body;

    if (!title || !description || !dueDate || !teamId || !assignedTo || !creatorId) {
        throw new ApiError(400, "Provide all fields")
    }

    const team = await Team.findByPk(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    const user = await User.findByPk(assignedTo)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.teamId == null) {
        throw new ApiError(400, "User is not in the team")
    }
    if (user.teamId !== teamId) {
        throw new ApiError(400, "User is in another team")
    }

    await Task.create({
        title,
        description,
        dueDate: new Date(dueDate),
        teamId,
        assignedTo,
        creator: creatorId
    })

    res.status(201).json({
        message: "success"
    })
})

const getAllTasks = asyncHandler(async (req, res) => {

    const tasks = await Task.findAll({
        include: [
            {
                model: User,
                as: 'assignedUser',
                attributes: ['id', 'username', 'email']
            },
            {
                model: Team,
                as: 'assignedTeam',
                attributes: ['id', 'name']
            }
        ],
    })

    if (tasks.length == 0) {
        throw new ApiError(404, "No tasks yet")
    }
    res.status(200).json({
        message: "success",
        data: tasks
    })
})

const getTaskDetails = asyncHandler(async (req, res) => {

    const { taskId } = req.params

    const task = await Task.findOne({
        where: { id: taskId },
        include: [
            {
                model: User,
                as: 'assignedUser',
                attributes: ['id', 'username', 'email']
            },
            {
                model: Team,
                as: 'assignedTeam',
                attributes: ['id', 'name']
            }
        ],
    })
    res.status(200).json({
        message: "success",
        data: task
    })
})

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId, creatorId } = req.body;

    if (!taskId || !creatorId) {
        throw new ApiError(400, "Provide all fields")
    }

    const task = await Task.findByPk(taskId)

    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    if (task.creator != creatorId) {
        throw new ApiError(401, "Only task creator can delete.")
    }

    await Task.destroy({
        where: { id: taskId }
    })

    res.status(200).json({
        message: "success"
    })
})

const updateTask = asyncHandler(async (req, res) => {
    const { creatorId, taskId, assignedTo, teamId, dueDate, status, description, title } = req.body;

    if (!creatorId || !taskId) {
        throw new ApiError(400, "Provide all fields")
    }

    const hasUpdateFields =
        typeof assignedTo !== 'undefined' ||
        typeof teamId !== 'undefined' ||
        typeof dueDate !== 'undefined' ||
        typeof status !== 'undefined' ||
        typeof description !== 'undefined' ||
        typeof title !== 'undefined';

    if (!hasUpdateFields) {
        throw new ApiError(400, "Provide at least one field to update");
    }


    const task = await Task.findByPk(taskId)

    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    if (task.creator != creatorId) {
        throw new ApiError(401, "Only task creator can modify.")
    }

    let fieldsToUpdate = {}

    if (typeof teamId !== 'undefined') {
        fieldsToUpdate.teamId = teamId;
    }

    if (assignedTo) {
        fieldsToUpdate.assignedTo = assignedTo
    }

    if (dueDate) {
        fieldsToUpdate.dueDate = new Date(dueDate)
    }

    if (status) {
        fieldsToUpdate.status = status
    }

    if (description) {
        fieldsToUpdate.description = description
    }

    if (title) {
        fieldsToUpdate.title = title
    }

    await Task.update(fieldsToUpdate, { where: { id: taskId } })

    res.status(200).json({
        message: "success"
    })

})


export { create, getAllTasks, getTaskDetails, deleteTask, updateTask }