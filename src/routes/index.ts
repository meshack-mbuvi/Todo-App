import userRoutes from './user'
import projectRoutes from './project'
import todoRoutes from './todo'

import { Router } from 'express';

const router = Router()

router.use('/users', userRoutes)
router.use('/projects', projectRoutes)
router.use('/projects/:projectId/todos', todoRoutes)

export default router;
