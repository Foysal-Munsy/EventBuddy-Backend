import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ default: 4 })
  totalSeats: number;

  @Column({ default: 0 })
  bookedSeats: number;

  @Column({ nullable: true })
  imageUrl: string;
}
