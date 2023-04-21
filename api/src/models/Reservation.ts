import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'



@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string

  @Column(DataType.STRING)
  name: string

  @Column(DataType.STRING)
  email: string

  @Column(DataType.INTEGER)
  party_size: number

  @Column(DataType.DATE)
  datetime: Date

  @DeletedAt
  deleted_at: Date

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date
}
