import { Project } from '../entity/project';
import { getRepository } from 'typeorm';
import { Todo } from '../entity/todos';

export class TodoController {
 static async create(req: any, res: any) {
  try {
   const {
    body: { title, projectId },
    user
   } = req;

   const project = await getRepository(Project).findOne({
    id: projectId,
    user: user.id
   });
   if (!project) {
    return res
     .status(404)
     .send({ message: "You don't have a project with given id" });
   }

   const todo = await new Todo();
   // A project should not have more than one similar titles
   const todoExists = await getRepository(Todo).findOne({
    project: projectId,
    title
   });

   if (todoExists) throw 'Todo exists';

   todo.title = title;
   todo.project = project;

   const results = await getRepository(Todo).save(todo);

   return res.status(201).send({
    id: results.id,
    title: results.title
   });
  } catch (error) {
   return res.status(409).send({ message: 'A todo with similar title exists' });
  }
 }

 static async getAll(req: any, res: any) {
  const {
   params: { projectId }
  } = req;

  const todos = await getRepository(Todo).find({
   project: projectId
  });

  return res.status(200).send(todos);
 }

 static async getOne(req: any, res: any) {
  const {
   params: { todoId }
  } = req;
  const todo = await getRepository(Todo).findOne({ id: todoId });

  if (!todo) {
   return res.status(404).send({ message: 'No todo found with given todoId' });
  }
  return res.status(200).send(todo);
 }

 static async updateTodo(req: any, res: any) {
  const {
   params: { todoId },
   body: { title }
  } = req;
  const todo = await getRepository(Todo).findOne({
   id: todoId
  });

  if (!todo) {
   return res.status(404).send({ message: 'No todo found with given todoId' });
  }

  todo.title = title || todo.title;

  const result = await getRepository(Todo).save(todo);
  return res.status(200).send(result);
 }

 static async startTodo(req: any, res: any) {
  const {
   params: { todoId },
   body: { started }
  } = req;
     if ((typeof started) != typeof true) {
      return res
       .status(400)
       .send({ message: 'Started should be boolaen' });
     }
     try {
   const todo = await getRepository(Todo).findOne({
    id: todoId
   });

   if (!todo) {
    return res.status(404).send({ message: 'No todo found with given Id' });
   }

   todo.started = started === undefined ? todo.started : started;

   const result = await getRepository(Todo).save(todo);
   return res.status(200).send(result);
  } catch (e) {
      console.log(e)
      return res.status(500)
          .send({ message: 'An error occurred. Try again later' })
  }
 }
}
