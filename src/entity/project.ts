import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { User } from './user';
import { Todo } from './todos';


@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @Column({ default: '' })
    description: string;

    @ManyToOne(type => User, user => user.projects)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(type => Todo, todo => todo.project)
    todos: Todo[];
}
