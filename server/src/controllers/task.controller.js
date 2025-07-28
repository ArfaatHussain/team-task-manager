import { Task } from "../models/task.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create = asyncHandler(async (req, res) => {

    const { title, description, dueDate, teamId, creatorId } = req.body;

    if (!title || !description || !dueDate || !teamId || !creatorId) {
        throw new ApiError(400, "Provide all fields")
    }

    const team = await Team.findByPk(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    const newTask = await Task.create({
        title,
        description,
        dueDate: new Date(dueDate),
        teamId,
        creator: creatorId
    })

    res.status(201).json({
        message: "success",
        newTask: newTask
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
    const { taskId, assignedTo, teamId, dueDate, status, description, title } = req.body;

    if (!taskId) {
        throw new ApiError(400, "Task ID is missing")
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

    let fieldsToUpdate = {}

    if (typeof teamId !== 'undefined') {
        fieldsToUpdate.teamId = teamId;
    }

    if (typeof assignedTo !== 'undefined') {
        fieldsToUpdate.assignedTo = assignedTo;
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

const getAllUnassignedTasks = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const tasks = await Task.findAll({
        where: { assignedTo: null, creator: userId }
    })

    if (tasks.length == 0) {
        throw new ApiError(404, "No tasks found")
    }

    res.status(200).json({
        message: "success",
        tasks: tasks
    })
})

const assignTask = asyncHandler(async (req, res) => {
    const { assignedTo, taskId, teamId } = req.body;

    console.log("Request Body: ", req.body);

    if (!assignedTo || !taskId) {
        throw new ApiError(400, "Provide all fields")
    }

    const task = await Task.findByPk(taskId)
    if(teamId){
        task.teamId = teamId
    }
    task.assignedTo = assignedTo
    await task.save()

    res.status(200).json({
        message: "Task assigned successfully",
    })

})

const getAllAssignedTasks = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is missing")
    }
    const tasks = await Task.findAll({
        where: { assignedTo: userId, status: "Pending" }
    })

    if (tasks.length == 0) {
        throw new ApiError(404, "No tasks assigned to this user")
    }

    res.status(200).json({
        message: "success",
        tasks: tasks
    })
})

const getAllCreatedTasks = asyncHandler(async (req, res) => {

    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400,"User ID is missing")
    }

    const tasks = await Task.findAll({
        where: {creator: userId},
        include: [
            {
                model: Team,
                as: 'assignedTeam',
                attributes: ['id','name','totalMembers']
            },
            {
                model: User,
                as: 'assignedUser',
                attributes: ['id','username']
            }
        ]
    })

    if(tasks.length == 0){
        throw new ApiError(404,"No Tasks created by this user")
    }

    res.status(200).json({
        message: "success",
        tasks: tasks
    })

})

export { create, getAllTasks, getTaskDetails, deleteTask, updateTask, getAllUnassignedTasks, assignTask, getAllAssignedTasks, getAllCreatedTasks }