import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project';


@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: false })
    started: boolean;

    @Column({ default: false })
    finished: boolean;

    @ManyToOne(type => Project, project => project.todos)
    @JoinColumn({ name: 'projectId' })
    project: Project;
}
