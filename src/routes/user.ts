import { Router } from 'express';
import { UserController } from '../controllers/user';
import {
    userSignUpRequestSchema,
    userLoginRequestSchema
} from '../middleware/validators/requestsSchema';

import { joiValidator } from '../middleware'

const router = Router();

router.post('/signup',
    joiValidator('body', userSignUpRequestSchema),
    UserController.signUp
)

router.post('/login',
    joiValidator('body', userLoginRequestSchema),
    UserController.login
)

export default router;
