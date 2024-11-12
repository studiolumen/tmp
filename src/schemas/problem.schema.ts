import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ProblemCategory } from "../common/types";

import { Classroom } from "./group.schema";
import { User } from "./user.schema";

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string = null;

  @Column()
  description: string = null;

  @Column()
  category: ProblemCategory = null;

  @Column()
  difficulty: number = null;

  /**
   * unit: milliseconds
   */
  @Column()
  time_limit: number = null;

  /**
   * unit: megabytes
   */
  @Column()
  memory_limit: number = null;

  @Column()
  restricted: number = null;

  @OneToMany(() => TestCase, (testCase) => testCase.problem)
  testCases: TestCase[];

  @OneToMany(() => PublicProblem, (publicProblem) => publicProblem.problem)
  publicProblem: TestCase[];

  @OneToMany(() => ClassProblem, (classProblem) => classProblem.problem)
  classProblem: TestCase[];

  @ManyToOne(() => User)
  user: User;
}

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  input: string = null;

  @Column()
  output: string = null;

  @Column()
  show_user: boolean = null;

  @ManyToOne(() => Problem, (problem) => problem.testCases, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  problem: Problem;
}

@Entity()
export class PublicProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Problem, (problem) => problem.publicProblem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  problem: Problem;
}
@Entity()
export class ClassProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Problem, (problem) => problem.classProblem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  problem: Problem;

  @ManyToOne(() => Classroom, (classroom) => classroom.problem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classroom: Classroom;
}
