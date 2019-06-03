import { Router } from 'express';
import { ProjectController } from '../controllers/project';
import {
    projectRequestSchema
} from '../middleware/index';

import { joiValidator } from '../middleware'

const router = Router();

router.post('/',
    joiValidator('body', projectRequestSchema),
    ProjectController.create
)

router.get('/',
    ProjectController.getAll
)

export default router;
