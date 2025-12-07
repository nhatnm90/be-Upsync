import { Request, Response, NextFunction } from 'express'
import { taskContainer } from '../container/taskContainer'
import { BadRequestError } from '../types/httpError'

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId
    const filter = (req.query.filter as string) ?? 'all'

    if (!userId || !req.query || !filter) {
      return next(new BadRequestError('The task is missing on the parameter'))
    }
    const result = await taskContainer.taskService.getAllTasks(userId, filter)

    res.status(200).json({ ...result })
  } catch (error) {
    next(error)
  }
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body
    const newTask = await taskContainer.taskService.create(payload)
    res.status(201).json(newTask)
  } catch (error) {
    next(error)
  }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id
    if (!taskId) {
      return next(new BadRequestError('The task is missing on the parameter'))
    }

    const updatedTask = await taskContainer.taskService.update(taskId, { ...req.body })

    res.status(201).json(updatedTask)
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id
    if (!taskId) {
      return next(new BadRequestError('The task is missing on the parameter'))
    }
    await taskContainer.taskService.delete(taskId)
    res.status(200).json({ message: 'Task deleted' })
  } catch (error) {
    next(error)
  }
}
