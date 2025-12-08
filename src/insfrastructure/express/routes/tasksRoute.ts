import express from 'express'
import { getAllTasks, createTask, updateTask, deleteTask } from '@/presentation/controllers/tasksController'

const router = express.Router()

// TASKS
router.get('/:userId', getAllTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
