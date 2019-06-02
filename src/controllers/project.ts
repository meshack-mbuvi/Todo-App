import { Project } from '../entity/project';
import { getRepository } from 'typeorm';

export class ProjectController {
    static async create(req: any, res: any) {
        try {
            const {
                body:
                { title, description },
                user
            } = req;

            const project = await new Project()

            project.title = title;
            project.description = description || '';
            project.user = user;

            const results = await getRepository(Project).save(project)

            return res.status(201).send(
                {
                    id: results.id,
                    title: results.title,
                    description: results.description
                })
        } catch (error) {
            return res.status(409).send({ message: "A project with similar title exists" })
        }
    }

    static async getAll(req: any, res: any) {
        const {
            user
        } = req;

        const projects = await getRepository(Project).find({ user })

        return res.status(200).send(
            projects)

    }

}
