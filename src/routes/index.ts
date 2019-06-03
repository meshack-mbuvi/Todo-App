import userRoutes from './user'
import projectRoutes from './project'

import { Router } from 'express';

const router = Router()

router.use('/users', userRoutes)
router.use('/projects', projectRoutes)

export default router;
