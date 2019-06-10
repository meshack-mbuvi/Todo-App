import { Router } from 'express';
import { TodoController } from '../controllers/todo';
import {
    todoRequestSchema,
  singleTodoRequestSchema,
  todoUpdateRequestSchema
} from '../middleware/index';

import { joiValidator } from '../middleware'

const router = Router({ mergeParams: true });

router.post('/',
    joiValidator('body', todoRequestSchema),
    TodoController.create
)
router.get('/',
    TodoController.getAll
)
router.get('/:todoId',
    joiValidator('params', singleTodoRequestSchema),
    TodoController.getOne
)
router.put('/:todoId',
  joiValidator('body', todoUpdateRequestSchema),
    joiValidator('params', singleTodoRequestSchema),
    TodoController.updateTodo
)

export default router;
